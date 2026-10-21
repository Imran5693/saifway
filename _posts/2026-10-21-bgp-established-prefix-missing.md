---
layout: post
title: 'BGP Established but Route Missing: Trace Prefix Export and Installation'
seo_title: 'BGP Established but Route Missing: Prefix Policy Checks'
description: Trace one BGP prefix from local origination through export, import, best-path selection and RIB installation before a scoped prefix-list correction.
date: '2026-05-28T09:00:00+04:00'
author: Imran Sarwar
permalink: /blog/bgp-established-prefix-missing/
expertise: infrastructure
topic_label: Routing troubleshooting
article_type: Troubleshooting guide and hypothetical lab
thumbnail: /assets/images/blog/bgp-established-prefix-missing-thumbnail.webp
image: /assets/images/blog/bgp-established-prefix-missing-thumbnail.webp
thumbnail_width: 1200
thumbnail_height: 630
image_alt: Conceptual established BGP session with one route stopped at an export policy gate
tags:
- BGP established route not received
- Routing troubleshooting
search_terms:
- BGP established route not received
- BGP prefix not advertised
- BGP route not installed
- BGP advertised-routes missing
- BGP outbound prefix list
copy_commands: true
related_posts:
- bgp-neighbor-stuck-active
- ospf-exstart-mtu-mismatch
- python-network-config-drift
service_url: /remote-network-infrastructure-support/
cta_title: Need help tracing an infrastructure failure?
cta_text: Share sanitized evidence, the platform version and the intended behavior. Imran Sarwar can assess a scoped infrastructure investigation.
published: true
sitemap: true
primary_keyword: BGP established route not received
secondary_keywords:
- BGP prefix not advertised
- BGP route not installed
- BGP advertised-routes missing
- BGP outbound prefix list
---

An Established BGP neighbor proves that a session exists. It does not prove that a particular prefix was originated, exported, accepted or installed. Pick one prefix and one address family, then record where that route disappears. Restarting a healthy session erases useful context and can affect every route learned through it.

**Scope and evidence:** Hypothetical classic IOS XE 17.x IPv4 unicast eBGP lab in the global routing table. R1 is AS 64512 at `192.0.2.1/30`; R2 is AS 64513 at `192.0.2.2/30`. The target is exactly `198.51.100.0/24`. No live route output or successful advertisement is claimed. VRFs, VPN address families, route servers and controller-managed policy require their corresponding commands and design checks.

<span id="establish-the-one-prefix-evidence-contract"></span>

## Define the Missing BGP Prefix, Peer and Address Family

R1 already has a connected Loopback10 route for `198.51.100.0/24` and a matching IPv4 BGP network statement. Its outbound `TO-R2` prefix list permits another approved prefix at sequence 10, then denies everything at sequence 100. The intended `/24` was omitted. R2's import policy already permits the target and its next hop is directly reachable. These are lab assumptions to prove with evidence, not facts to infer from Established.

{% include blog-diagram.html src="/assets/images/diagrams/bgp-established-prefix-missing-topology.svg" scrollable=true alt="R1 AS64512 and R2 AS64513 have an established session on 192.0.2.0/30; target 198.51.100.0/24 is stopped by R1 export policy until one exact permit is added" caption="Hypothetical before/after. The session stays established; only the export decision for one approved prefix changes." %}

<span id="step-1-confirm-family-and-local-origination"></span>

## Verify BGP Address Family and Exact Prefix Origination

On **R1, read-only privileged EXEC**:

```text
show ip bgp summary
show ip bgp neighbors 192.0.2.2
show ip route 198.51.100.0 255.255.255.0
show ip bgp 198.51.100.0 255.255.255.0
show running-config | section router bgp
```

Check that IPv4 unicast is active for this peer and the session has remained up. A prefix count in the summary is not a search result for the target. The route lookup must identify the exact `/24`, not merely a covering default route. A BGP `network` statement with a mask needs an exact route in the local RIB. If the prefix never entered local BGP, inspect its intended origin before looking at R2. Do not add a discard route simply to make an announcement appear: that can advertise reachability the router cannot deliver. Cisco documents the [exact-match origination rule](https://www.cisco.com/c/en/us/support/docs/ip/border-gateway-protocol-bgp/19345-bgp-noad.html).

<span id="step-2-distinguish-export-acceptance-and-installation"></span>

## Trace BGP Export, Import, Best Path and RIB Installation

Inspect R1 export and then R2 acceptance. These are **read-only**:

```text
show ip prefix-list TO-R2
show ip bgp neighbors 192.0.2.2 advertised-routes
```

On **R2**, use the inverse peer address:

```text
show ip bgp neighbors 192.0.2.1 routes
show ip bgp 198.51.100.0 255.255.255.0
show ip route 198.51.100.0 255.255.255.0
```

| Checkpoint | Evidence sought | If target is absent or unusable |
| --- | --- | --- |
| R1 local BGP | Eligible target path and attributes | Fix the origin or path eligibility first |
| R1 advertised routes | Target exported to this neighbor/family | Inspect outbound prefix lists, route maps and communities |
| R2 neighbor routes | Accepted paths associated with R1 | Inspect import policy, AS loop checks and update evidence |
| R2 target BGP entry | Valid path, reachable next hop and best-path result | Investigate next-hop reachability and selection reason |
| R2 exact RIB route | Target installed with intended next hop/protocol | Check competing route preference and RIB failure |

The neighbor `routes` view is not a full unfiltered record of every received update. `received-routes` availability depends on retained inbound information and configuration; do not enable memory-intensive inbound soft reconfiguration just to populate a troubleshooting screenshot. R1's advertisement view also does not prove R2 accepted a packet. Correlate both ends and their times. Cisco's [IOS XE BGP guide](https://www.cisco.com/c/en/us/td/docs/routers/ios/config/17-x/ip-routing/b-ip-routing/m_irg-basic-net-0.html) describes the neighbor views.

If the route exists in BGP but is not installed, inspect its detail and next-hop route. A valid best path can lose installation to a more preferred route from another source. Conversely, a next-hop failure is not an export prefix-list failure. The [BGP basic troubleshooting reference](https://www.cisco.com/c/en/us/support/docs/ip/border-gateway-protocol-bgp/218027-troubleshoot-border-gateway-protocol-bas.html) explains these boundaries. If the neighbor is no longer Established, use the separate [BGP Active guide](/blog/bgp-neighbor-stuck-active/) first.

{% include blog-diagram.html src="/assets/images/diagrams/bgp-established-prefix-missing-flow.svg" scrollable=true alt="Decision flow checks local BGP presence, export and receiver acceptance before checking best path and RIB installation" caption="Trace the same exact prefix in the same address family at every checkpoint." %}

<span id="step-3-add-one-approved-export-permission"></span>

## Add the Approved Exact Prefix to BGP Export Policy

**Configuration change — R1, lab only.** Confirm `TO-R2` is attached directly outbound to this IPv4 peer, sequence 20 is unused, and the list is not reused by other peers or route maps. Record the full original list and all references. If it is shared, use a separately reviewed policy rather than changing every consumer unintentionally.

```text
configure terminal
ip prefix-list TO-R2 seq 20 permit 198.51.100.0/24
end
```

With no `ge` or `le`, this permits only the exact `/24`; it does not authorize all its more-specific routes. Sequence 20 is before the recorded sequence-100 deny. This action is appropriate only after validating prefix ownership, forwarding and the actual export omission. It does not replace the complete policy or add `permit 0.0.0.0/0 le 32`.

**Operational change:** After confirming syntax on the target image and assessing update load, re-evaluate outbound policy without tearing down TCP:

```text
clear ip bgp 192.0.2.2 soft out
```

A soft outbound operation can resend updates for more than the target prefix. Monitor policy deltas and neighbor uptime. Do not substitute an unqualified hard clear on a production peer.

<span id="verify-the-route-and-preserve-a-precise-rollback"></span>

## Verify BGP Advertisement and Forwarding with Policy Rollback

Repeat the five checkpoints. Expected lab evidence is the target in R1 export, R2 BGP and R2 RIB with next hop `192.0.2.1`, while neighbor uptime continues. Compare the entire export set to its baseline; acceptance of the target is insufficient if other unauthorized routes changed. Then test an authorized destination inside the prefix using a specified source and verify the return route. BGP installation does not establish firewall permission or application health.

Rollback removes only the newly introduced sequence, then re-evaluates outbound policy:

```text
configure terminal
no ip prefix-list TO-R2 seq 20
end
clear ip bgp 192.0.2.2 soft out
```

Expect the target to be withdrawn if no other export rule permits it. Record actual control-plane and forwarding evidence before persisting a configuration. Prevent recurrence with peer-specific policy ownership and approved-prefix comparisons; the [configuration drift guide](/blog/python-network-config-drift/) supports the configuration review, while the [OSPF MTU guide](/blog/ospf-exstart-mtu-mismatch/) addresses an entirely different adjacency fault.
