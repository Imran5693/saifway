---
layout: post
title: 'Palo Alto Asymmetric Routing: Trace Missing Return Traffic and Sessions'
seo_title: 'Palo Alto Asymmetric Routing: Return Traffic Checks'
description: Trace missing Palo Alto return traffic using exact flow tuples, session counters and endpoint routes before correcting a demonstrated firewall bypass.
date: '2026-01-04T09:00:00+04:00'
author: Imran Sarwar
permalink: /blog/palo-alto-return-traffic-missing/
expertise: infrastructure
topic_label: Firewall and routing troubleshooting
article_type: Troubleshooting guide and hypothetical lab
thumbnail: /assets/images/blog/palo-alto-return-traffic-missing-thumbnail.webp
image: /assets/images/blog/palo-alto-return-traffic-missing-thumbnail.webp
thumbnail_width: 1200
thumbnail_height: 630
image_alt: Conceptual stateful firewall forward path with return traffic bypassing through another router
tags:
- Palo Alto asymmetric routing troubleshooting
- Firewall and routing troubleshooting
search_terms:
- Palo Alto asymmetric routing troubleshooting
- Palo Alto return packets missing
- Palo Alto session one way traffic
- PAN-OS reverse route lookup
- server return path bypass firewall
copy_commands: true
related_posts:
- palo-alto-nat-matches-traffic-denied
- ubuntu-static-route-not-working
- bgp-established-prefix-missing
service_url: /remote-network-infrastructure-support/
cta_title: Need help tracing an infrastructure failure?
cta_text: Share sanitized evidence, the platform version and the intended behavior. Imran Sarwar can assess a scoped infrastructure investigation.
published: true
sitemap: true
primary_keyword: Palo Alto asymmetric routing troubleshooting
secondary_keywords:
- Palo Alto return packets missing
- Palo Alto session one way traffic
- PAN-OS reverse route lookup
- server return path bypass firewall
---

An allow log with outbound packets and no replies does not prove that the firewall dropped the return traffic. The server may never have replied, or its route may send replies around the stateful firewall. Compare both directions of one connection before adding a policy rule or relaxing state inspection.

**Scope and evidence:** Proposed PAN-OS 11.1 Layer 3 lab using a classic virtual router named `default`, no NAT, no PBF, no ECMP and no HA. Client `198.51.100.20` connects to Linux server `192.0.2.20:443`. The firewall's server-side interface is `192.0.2.1/24`. The server incorrectly returns client-subnet traffic through alternate gateway `192.0.2.254`, which bypasses the firewall. No captures, device outputs or successful application results are claimed. Advanced Routing Engine logical routers and HA designs require their own commands and state-owner analysis.

<span id="draw-two-paths-for-one-tuple"></span>

## Map Forward and Return Tuples for the Palo Alto Session

Record the actual client source port, destination port, protocol, ingress/egress interfaces, zones, VSYS and time window. Do not combine evidence from successive browser connections with different ephemeral ports. For NAT traffic, add original and translated tuples in both directions; use the separate [NAT versus security policy guide](/blog/palo-alto-nat-matches-traffic-denied/) for those matching rules. The no-NAT example here isolates route selection.

{% include blog-diagram.html src="/assets/images/diagrams/palo-alto-return-traffic-missing-topology.svg" scrollable=true alt="Client 198.51.100.20 reaches server 192.0.2.20 through firewall gateway 192.0.2.1; before correction the server replies through bypass gateway 192.0.2.254, afterward the client-subnet route returns through the firewall" caption="Hypothetical two-direction example. The correction belongs to the server route; firewall security policy is already correct." %}

<span id="step-1-inspect-the-matching-firewall-session"></span>

## Inspect PAN-OS Session State and Forwarding Lookups

On **PAN-OS operational CLI, read-only**, in the intended VSYS:

```text
show session all filter source 198.51.100.20 destination 192.0.2.20 destination-port 443 protocol 6
test routing fib-lookup virtual-router default ip 192.0.2.20
test routing fib-lookup virtual-router default ip 198.51.100.20
```

Use the returned session identifier with `show session id` followed by that actual numeric ID. Inspect the two directional flows, interfaces, state, matching security/NAT/PBF rules and packet/byte counters. Expected fault evidence is client-to-server activity with little or no server-to-client activity, but that is a symptom rather than proof of asymmetry. The FIB checks establish the firewall's current destination lookup; they do not establish the server's route, an already selected session path or every PBF/ECMP decision. Check syntax on the installed image; the vendor [routing test reference](https://docs.paloaltonetworks.com/ngfw/help/10-2/device/device-troubleshooting/routing-troubleshooting-test) explains the lookup scope.

| Checkpoint | Evidence to compare | What an absence cannot prove |
| --- | --- | --- |
| Firewall receives client packet | Exact tuple on ingress | That the application is listening |
| Firewall transmits toward server | Correct egress and destination | That the server received or accepted it |
| Server emits a reply | Reverse tuple and selected next hop | That it crossed the firewall |
| Firewall receives reverse packet | Correct state owner/path | That application-level response succeeded |
| Client receives reply | End-to-end delivery | That every subsequent session uses that path |

Traffic logs may be written at session end depending on policy. A missing final log during an active attempt is not proof of no session. Consult the installed release's session command reference; the [PAN-OS hierarchy](https://docs.paloaltonetworks.com/ngfw/pan-os-cli-quick-start/cli-command-hierarchy/pan-os-11-2-cli-ops-command-hierarchy) shows available filters in 11.2 and must not be treated as a guarantee for every 11.1 build.

<span id="step-2-prove-where-the-reverse-packet-goes"></span>

## Trace Server Replies and the Actual Return Next Hop

From the **Linux server, read-only route diagnostics**:

```bash
ip -br address
ip -4 rule show
ip -4 route get 198.51.100.20 from 192.0.2.20
ss -lntp
```

In the proposed fault, route selection uses `.254` on the server LAN even though the request arrived through `.1`. Confirm the correct source/interface and whether policy routing or a network namespace changes this lookup. A missing listener or application refusal is a different failure, not something a symmetric return setting fixes. Record whether the server emitted SYN-ACK, RST or no reply during the same connection attempt.

If authorized, use a narrow bounded capture on the server LAN and the appropriate firewall receive/transmit stages for both directions. Account for NAT when setting filters and for hardware offload/capture visibility limitations. Captures can contain sensitive payloads; do not leave collection running or change offload globally without a reviewed procedure. Palo Alto documents the [capture stages](https://docs.paloaltonetworks.com/pan-os/11-1/pan-os-admin/monitoring/take-packet-captures/take-a-custom-packet-capture).

Seeing a server reply addressed to the alternate router's MAC, together with the server's route lookup and absent reverse firewall observation, supports the bypass diagnosis. An empty firewall capture alone does not. In HA, separately determine which node should own the session and whether state synchronization is healthy before applying this standalone example.

{% include blog-diagram.html src="/assets/images/diagrams/palo-alto-return-traffic-missing-flow.svg" scrollable=true alt="Decision flow verifies server receipt, server reply and return traffic through the intended firewall before inspecting state and client delivery" caption="Find the first missing observation; no reply is different from a reply taking the wrong path." %}

<span id="step-3-correct-the-demonstrated-endpoint-route"></span>

## Correct the Demonstrated Server Route Bypassing the Firewall

**Temporary route change — isolated Linux lab server.** Confirm the client subnet is intended to return through `192.0.2.1`, which is on-link, and the firewall has the onward route and approved policy. Record the original routes/rules and use out-of-band access. The lab assumes no existing specific route for this prefix and interface `ens18`. This host-route-table change affects every server flow to the client subnet, so assess the blast radius.

```bash
sudo ip route add 198.51.100.0/24 via 192.0.2.1 dev ens18
ip -4 route get 198.51.100.20 from 192.0.2.20
```

The intended lookup now selects `.1`; the default via `.254` remains for other destinations. If the command reports an existing route, stop and inspect it rather than replacing an unknown owner. This runtime change is not persistent. Once validated, implement the route through the host's authoritative configuration using the [Netplan route workflow](/blog/ubuntu-static-route-not-working/) where applicable.

Do not enable asymmetric TCP acceptance or add broad SNAT solely to conceal an unexplained path. PBF symmetric return can be appropriate for a deliberately designed multi-uplink environment, but it cannot pull a server reply through a firewall that the packet bypasses. Review the actual [symmetric return behavior](https://docs.paloaltonetworks.com/pan-os/11-1/pan-os-admin/policy/policy-based-forwarding/pbf/egress-path-and-symmetric-return) with the route owner before choosing it.

<span id="verify-a-fresh-session-and-keep-narrow-rollback"></span>

## Verify a New Bidirectional Session and Route Rollback

Open a new controlled connection, record its new tuple and compare both directional counters and endpoint observations. Confirm the server reply traverses the intended firewall and the application completes. Avoid clearing every session; an old session can retain different state, but any targeted session interruption still needs its own impact assessment.

Rollback removes only the route added above, if it is still that exact entry:

```bash
sudo ip route del 198.51.100.0/24 via 192.0.2.1 dev ens18
```

Expect the known bypass to return. Reverting runtime state does not undo a later persistent configuration change; track both. Prevent recurrence with a two-direction flow worksheet and route ownership across server, firewall and upstream routers. If the route itself is missing in BGP, the [one-prefix BGP guide](/blog/bgp-established-prefix-missing/) addresses that earlier control-plane boundary.
