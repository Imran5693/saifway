---
layout: post
title: 'BGP Flaps During Large Updates: Troubleshoot Path MTU and TCP Loss'
seo_title: 'BGP Flaps During Large Updates: Path MTU Checks'
description: Investigate BGP flaps during large exchanges using peer reset evidence, source-specific DF probes and TCP retransmissions before a scoped PMTUD repair.
date: '2026-07-12T09:00:00+04:00'
author: Imran Sarwar
permalink: /blog/bgp-large-updates-path-mtu/
expertise: infrastructure
topic_label: Routing troubleshooting
article_type: Troubleshooting guide and hypothetical lab
thumbnail: /assets/images/blog/bgp-large-updates-path-mtu-thumbnail.webp
image: /assets/images/blog/bgp-large-updates-path-mtu-thumbnail.webp
thumbnail_width: 1200
thumbnail_height: 630
image_alt: Conceptual BGP path through a narrow tunnel with large packets blocked and separate ICMP feedback
tags:
- BGP flaps large updates MTU
- Routing troubleshooting
search_terms:
- BGP flaps large updates MTU
- BGP PMTUD black hole
- BGP TCP retransmissions MTU
- large DF ping fails BGP
- BGP tunnel MSS path MTU
copy_commands: true
related_posts:
- bgp-neighbor-stuck-active
- bgp-established-prefix-missing
- ospf-exstart-mtu-mismatch
service_url: /remote-network-infrastructure-support/
cta_title: Need help tracing an infrastructure failure?
cta_text: Share sanitized evidence, the platform version and the intended behavior. Imran Sarwar can assess a scoped infrastructure investigation.
published: true
sitemap: true
primary_keyword: BGP flaps large updates MTU
secondary_keywords:
- BGP PMTUD black hole
- BGP TCP retransmissions MTU
- large DF ping fails BGP
- BGP tunnel MSS path MTU
---

When BGP establishes and later resets during a large exchange, an ordinary ping does not eliminate a transport problem. Small packets can pass while larger TCP segments stall on a lower-MTU hop. Correlate the reset reason, retransmissions and the actual path before concluding that an update policy or BGP timer is wrong.

**Scope and evidence:** Proposed IOS XE IPv4 BGP peers using Loopback0 addresses `192.0.2.1/32` and `192.0.2.2/32` over an already working routed path. A tunnel in that path has an effective inner IPv4 MTU of 1400 bytes; the endpoints can initially send larger DF packets, and required ICMP fragmentation-needed feedback is blocked. No packet captures, live reset reason or successful recovery is claimed. IPv6 uses Packet Too Big semantics and is outside this example. A tunnel's effective MTU must be measured/derived for its actual encapsulation, not copied from 1400.

<span id="establish-a-credible-mtu-hypothesis"></span>

## Correlate BGP Update-Exchange Flaps with a Path MTU Hypothesis

The example assumes the BGP session works at first and larger segments later encounter the path limit. It does not assume that every update message fits into one TCP packet: BGP runs over a byte stream, and TCP segments messages according to its current MSS/PMTU behavior. A large route exchange is a trigger to investigate packet size, not proof that a particular BGP UPDATE was too large.

{% include blog-diagram.html src="/assets/images/diagrams/bgp-large-updates-path-mtu-topology.svg" scrollable=true alt="Loopback BGP peers use a routed tunnel path with 1400-byte inner MTU; small packets pass, larger DF packets need ICMP feedback that is blocked before repair" caption="Hypothetical PMTUD black-hole example. Restoring feedback permits adaptation; it does not increase the path MTU." %}

On **both peers, read-only privileged EXEC**:

```text
show clock
show ip bgp summary
show ip bgp neighbors 192.0.2.2
show tcp brief all
show interfaces Tunnel0
```

On the opposite peer, use neighbor `192.0.2.1` and the actual path interface. Record uptime, last reset reason, TCP endpoint/source, negotiated transport information and interface counters. A hold-timer expiry can follow stalled delivery but also congestion, CPU loss or other faults. An administrative reset, notification error or simultaneous link failure can point elsewhere. Never label a flap as MTU solely because it happens near a route refresh. Cisco's [BGP MTU troubleshooting guide](https://www.cisco.com/c/en/us/support/docs/ip/border-gateway-protocol-bgp/116377-troubleshoot-bgp-mtu.html) provides the transport investigation context.

<span id="step-1-use-the-real-source-and-controlled-df-sizes"></span>

## Run Source-Matched Extended Ping Tests with Controlled DF Sizes

Use IOS XE **extended ping** from privileged EXEC so the source and DF choice are explicit. Enter `ping`, choose IP and the peer address, then answer its prompts. Check the target image's wording; the following table is an input plan, not captured console output:

| Extended ping field | Controlled lab choice |
| --- | --- |
| Target | Peer Loopback0 address |
| Repeat count | 5 |
| Datagram size | Separate runs at 100, 1400 and 1500 bytes |
| Extended commands | Yes |
| Source address/interface | The same Loopback0 source used by BGP |
| Set DF bit | Yes |
| Other options | Retain approved defaults; no broad sweep or flood |

Expected fault-state evidence is small/1400-byte success and failure at 1500 on the constrained path, subject to ICMP policy. Cisco IOS datagram size is an IP-datagram size for this test; it is not the same input as Linux ICMP payload size or TCP MSS. For IPv4 without options, a 1400-byte IP limit leaves at most 1360 bytes after ordinary IP/TCP headers, and TCP options can reduce payload further. Confirm actual headers rather than setting MSS from a generic subtraction.

A DF echo failure does not prove BGP segments fail in the same way: ICMP and TCP may be filtered differently, ECMP can choose another path, and return direction may have a different limit. Repeat the source/path comparison in both directions. Do not increase probe sizes or counts aggressively on production infrastructure.

<span id="step-2-correlate-real-tcp-loss-and-feedback"></span>

## Trace Large TCP Retransmissions and ICMP PMTUD Feedback

With authorization, collect a bounded capture around one controlled attempt at the endpoints and constrained hop. Look for large DF TCP packets being retransmitted, their acknowledgment behavior, and ICMP Destination Unreachable type 3/code 4 containing the relevant original packet headers and next-hop MTU. Compare observations across the hop; a single capture's silence is not proof of a drop location.

| Observation | Interpretation | Next action |
| --- | --- | --- |
| Large DF packets leave, disappear at constrained hop | Size-dependent forwarding failure is plausible | Check ICMP generation and reverse delivery |
| Feedback generated but not delivered to sender | PMTUD feedback path is a candidate fault | Trace ACL, control-plane and return routing |
| Feedback reaches sender but large retransmits persist | Acceptance/transport state needs analysis | Inspect actual TCP/PMTU behavior and platform support |
| All sizes fail or unrelated reset reason exists | MTU alone is insufficient | Return to route, policy, loss and peer health evidence |

The [IPv4 PMTUD specification](https://www.rfc-editor.org/rfc/rfc1191.html) describes feedback-based adaptation. Cisco's [encapsulation and MSS reference](https://www.cisco.com/c/en/us/support/docs/ip/generic-routing-encapsulation-gre/25885-pmtud-ipfrag.html) explains why tunnel overhead and router-originated TCP need separate treatment. A transit `ip tcp adjust-mss` setting is not automatically a fix for router-originated BGP traffic.

{% include blog-diagram.html src="/assets/images/diagrams/bgp-large-updates-path-mtu-flow.svg" scrollable=true alt="Decision flow correlates flap timing, size-specific loss and PMTUD feedback before choosing the demonstrated path correction" caption="Repair the proven transport boundary; keep unrelated BGP policy and timers unchanged." %}

<span id="step-3-repair-the-demonstrated-feedback-boundary"></span>

## Repair the Proven PMTUD Feedback or Path Configuration Fault

**Network policy change — hypothetical lab.** The path owner proves that the constrained router generates valid type 3/code 4 messages and a particular filter drops them before the affected BGP sender. Save the exact rule order, counters and route state. Permit the required validated PMTUD feedback through that boundary using the platform's reviewed control-plane/security policy, scoped to the intended recipients and topology. Confirm which addresses actually source the feedback; an arbitrary source restriction can keep legitimate path routers blocked.

No universal ACL stanza is supplied because direction, interface, control-plane policy and encapsulation differ. The reviewable change is the one demonstrated feedback drop, not an `allow any` rule. A different proven cause may instead require correcting an erroneous tunnel MTU or an endpoint transport setting with its owner. Do not disable PMTUD, clear DF or stretch hold timers as a reflex.

<span id="verify-adaptation-without-erasing-the-bottleneck"></span>

## Verify BGP Transport Adaptation and Preserve Policy Rollback

Repeat bounded probes and observe sender TCP behavior during an approved exchange. A 1500-byte DF echo can still fail correctly after repair because the path limit remains 1400; what should change is useful feedback and transport adaptation. Verify the intended routes and stable BGP operation over the agreed observation window, with no unauthorized route-policy changes. Do not inject a large route set or hard-clear a production neighbor solely to reproduce the symptom without a separate plan.

Rollback restores the saved narrow policy/configuration delta through its owner and repeats the baseline checks. It can recreate the known black hole, so coordinate impact and keep out-of-band access. Retain the evidence of actual packet sizes and feedback. For a peer that never establishes use the [BGP Active guide](/blog/bgp-neighbor-stuck-active/); for a missing route on a stable session use [one-prefix tracing](/blog/bgp-established-prefix-missing/). The [OSPF MTU guide](/blog/ospf-exstart-mtu-mismatch/) addresses a different protocol's adjacency checks.
