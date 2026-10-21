---
layout: post
title: 'Cisco LACP EtherChannel Not Forming: Troubleshoot Suspended and Individual Ports'
seo_title: 'Cisco LACP EtherChannel Not Forming: Member Checks'
description: Diagnose Cisco LACP EtherChannel suspended or individual ports using member flags, peer identity and negotiation checks before a scoped lab correction.
date: '2026-02-24T09:00:00+04:00'
author: Imran Sarwar
permalink: /blog/cisco-lacp-etherchannel-not-forming/
expertise: infrastructure
copy_commands: true
topic_label: Cisco switching troubleshooting
article_type: Troubleshooting guide and hypothetical lab
thumbnail: /assets/images/blog/cisco-lacp-etherchannel-not-forming-thumbnail.webp
image: /assets/images/blog/cisco-lacp-etherchannel-not-forming-thumbnail.webp
thumbnail_width: 1200
thumbnail_height: 630
image_alt: Two conceptual switches with parallel links showing an inactive member and a working aggregate
tags:
- Cisco LACP EtherChannel not forming
related_posts:
- cisco-vlan-cannot-ping-gateway
- pyats-pre-post-change-checks
- network-was-not-the-problem-real-noc-troubleshooting
service_url: /remote-network-infrastructure-support/
cta_title: Need help isolating an infrastructure failure?
cta_text: Share the affected scope, platform version and sanitized diagnostic evidence. Imran Sarwar can assess the technical fit and scope for remote infrastructure investigation.
published: true
sitemap: true
related_projects:
- title: Campus Area Network design project
  url: /projects/2024-12-10-campus-area-network/
primary_keyword: Cisco LACP EtherChannel not forming
secondary_keywords:
- EtherChannel ports suspended
- LACP individual port
- LACP passive passive
- show etherchannel summary flags
search_terms:
- Cisco LACP EtherChannel not forming
- EtherChannel ports suspended
- LACP individual port
- LACP passive passive
- show etherchannel summary flags
---

Two physical links are connected, yet the intended port-channel is down or one member stays suspended. Start with negotiation and bundle membership. A link light does not prove that LACP selected the port or that VLAN traffic can cross the aggregate.


**Scope and evidence:** Hypothetical lab, not a customer incident or captured device output. Documentation addresses are illustrative and must be replaced in an isolated lab. Commands were reviewed against the primary references below; no live switch or domain was tested. Read-only checks come first. Configuration changes require an authorized maintenance window, a saved baseline and a tested management/rollback path.

<span id="symptoms-scope-and-the-hypothetical-topology"></span>

## Cisco LACP EtherChannel Failure: Symptoms and Lab Topology

This guide targets Catalyst 9000 switches running IOS XE 17.x, using Cisco's Catalyst 9000 EtherChannel troubleshooting reference. It does not cover NX-OS vPC, server teaming or multi-chassis aggregation. The lab has SW-A and SW-B connected Gi1/0/1 to Gi1/0/1 and Gi1/0/2 to Gi1/0/2. Both links belong to Layer 2 Port-channel10, intended to trunk VLANs 10 and 20. Native VLAN 1 agrees on both ends; these lab defaults are not a production design recommendation.

The injected fault is both peers configured LACP passive. Neither initiates negotiation. No IP subnet is assigned to the Layer 2 bundle. Other causes, including incompatible member settings, physical faults and wrong cabling, must be separated from this fault.

{% include blog-diagram.html src="/assets/images/diagrams/cisco-lacp-etherchannel-not-forming.svg" alt="Two parallel links between SW-A and SW-B with passive passive negotiation failing, then active passive negotiation forming Port-channel10" scrollable=true caption="Hypothetical before/after: only SW-A negotiation mode changes; both links remain in one Layer 2 bundle." %}

<span id="step-1-read-bundle-and-member-status"></span>

## Read EtherChannel Summary and LACP Member Flags

Run these read-only commands in privileged EXEC on **both** switches. Do not start with shutdown/no shutdown or remove channel-group.

```text
show etherchannel summary
show interfaces status
show running-config interface port-channel10
show running-config interface gigabitEthernet1/0/1
show running-config interface gigabitEthernet1/0/2
show interfaces gigabitEthernet1/0/1
show interfaces gigabitEthernet1/0/2
```

| Evidence | Normal for this lab | Abnormal interpretation and next action |
| --- | --- | --- |
| EtherChannel summary | Po10(SU), each member marked (P) | S denotes Layer 2 and U in use. Read the output legend: (s) is suspended, (I) individual, (D) down. Flags vary by state; none alone establishes the root cause. |
| Interface status | Both links connected | Not connected/down: resolve optics, cable, administrative state or peer port first. |
| Port-channel configuration | Intended trunk, VLANs and native VLAN | Wrong logical settings: compare design and peer, then plan a coordinated correction. |
| Member configuration | Same group/protocol, compatible switching mode and negotiated speed | Passive/passive, static `on` versus LACP or inconsistent parameters: investigate the exact mismatch. Local group numbers do not have to match across peers. |
| Interface counters | Stable links, no growing physical error rate | Increasing CRC or flaps: inspect media and hardware before treating it as a protocol failure. Old cumulative errors need a time interval for interpretation. |

Member configuration and inherited logical settings interact on IOS XE. Compare operational state as well as the running configuration. Matching two pasted stanzas is not sufficient proof of compatibility.

<span id="step-2-distinguish-no-negotiation-from-failed-selection"></span>

## Check LACP Negotiation, Partner Identity and Member Selection

The following commands inspect LACP neighbors, control packet counters, logs and actual forwarding. They remain read-only.

```text
show lacp 10 neighbor
show lacp 10 counters
show logging
show interfaces trunk
show spanning-tree vlan 20
```

For a healthy bundle, the neighbor command should identify the intended remote system and member ports. The counters should show LACP exchanges on each member; compare two samples rather than assuming nonzero historical counters prove current health. Passive/passive may show no current peer and no new exchanges, but the same observation can result from a down link, protocol filtering or wrong cabling. Confirm both configurations before assigning this cause.

If packets arrive but a member is suspended, compare actor/partner information and member compatibility against Cisco's troubleshooting guide. The logs may identify negotiation or consistency failures. Treat log lines as evidence from your device, not a message every failure must generate. Review `show logging` locally and sanitize it before sharing.

The trunk command should show the intended logical aggregate carrying VLAN 20. A healthy LACP bundle can still have the wrong allowed VLAN list. STP should see the logical path with the expected forwarding role; blocking can be correct when another path exists. Do not disable STP or force static `mode on` to bypass the symptom.

<span id="root-cause-decision"></span>

## Identify the LACP Fault Before Changing Channel Mode

{% include blog-diagram.html src="/assets/images/diagrams/cisco-lacp-diagnostic-flow.svg" alt="LACP decision flow: physical ports up, current peer visible, then both members bundled; no branches direct to media, mode or compatibility checks" scrollable=true caption="Diagnostic decisions for the hypothetical Catalyst lab; a healthy bundle still needs service verification." %}

- **Physical port down? Yes:** repair the physical/admin issue, then recheck LACP. **No:** inspect peers.
- **Current LACP peer visible? No:** confirm cabling, mode and protocol on both ends. Passive/passive is one candidate. **Yes:** inspect selected membership and partner identity.
- **Both members bundled (P)? No:** compare compatibility and logs. **Yes:** troubleshoot logical trunk, STP and end-to-end service separately.

<span id="resolution-for-a-confirmed-passivepassive-lab-fault"></span>

## Correct a Confirmed LACP Passive-Passive Configuration

**Configuration-changing:** The baseline here already has a correctly defined trunk Port-channel10 and compatible members on both switches, with `channel-group 10 mode passive` on both sides. At least one side must actively initiate LACP. This example changes only SW-A. It is not a universal conversion recipe for an existing static channel.

Before changing a production aggregate, use out-of-band access, save both peers' stanzas, verify an alternate path and schedule interruption. Changes can rebundle links or interrupt all traffic on the channel. If the device rejects the mode update, stop and plan a platform-specific rebuild; do not remove membership on a remote production uplink interactively.

```text
configure terminal
interface range gigabitEthernet1/0/1 - 2
channel-group 10 mode active
end
```

This permits active/passive negotiation while preserving the existing trunk design. Active/active is also valid when intentionally configured. Confirm every member connects to the same intended partner system unless using a supported multi-chassis design.

For this isolated fault-injection lab, rollback restores SW-A to its recorded passive mode:

```text
configure terminal
interface range gigabitEthernet1/0/1 - 2
channel-group 10 mode passive
end
```

That rollback deliberately restores the broken passive/passive example. In production, use the documented prior **working** state or approved alternate path; do not call restoration of a known outage service recovery.

<span id="verification-and-prevention"></span>

## Verify LACP Members, Trunk Forwarding and Service Recovery

Repeat the summary, neighbor and counter commands. Expect Po10(SU), both members (P), the correct partner and increasing LACP exchanges. Repeat trunk and STP checks, then test approved services in both VLANs. A single traffic flow may hash onto one member; a working ping does not prove even distribution or the health of both data paths.

During a separate approved resilience test, remove one member at a time using the site's change procedure, confirm service continuity and restore it before testing the other. Do not perform this disruptive test merely to diagnose an incident. Persist accepted configuration with `copy running-config startup-config` after verification; it writes startup configuration.

Record actor/partner IDs, membership, logical VLANs and interface error deltas before changes. The existing [pyATS pre/post-change guide](/blog/pyats-pre-post-change-checks/) describes a related validation approach. If the aggregate is healthy but a VLAN still fails, follow the [gateway reachability guide](/blog/cisco-vlan-cannot-ping-gateway/).

<span id="primary-reference"></span>

## Cisco EtherChannel Troubleshooting References

[Cisco: Troubleshoot EtherChannels on Catalyst 9000 switches](https://www.cisco.com/c/en/us/support/docs/switches/catalyst-9300-series-switches/220367-troubleshoot-etherchannels-on-catalyst-9.html) documents negotiation checks, counters, partner data and suspended-port investigation. Debug commands from that reference are intentionally not part of this first-line workflow; use a scoped, approved diagnostic plan if read-only evidence remains inconclusive.
