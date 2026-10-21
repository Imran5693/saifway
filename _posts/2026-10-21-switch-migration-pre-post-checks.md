---
layout: post
title: 'Switch Migration Pre and Post Checks: VLAN, STP and LACP Evidence'
seo_title: 'Switch Migration Pre/Post Checks: VLAN, STP and LACP'
description: Capture switch migration VLAN, STP and LACP baselines, compare expected forwarding after cutover, and use explicit service acceptance and rollback gates.
date: '2026-02-12T09:00:00+04:00'
author: Imran Sarwar
permalink: /blog/switch-migration-pre-post-checks/
expertise: infrastructure
topic_label: Cisco switching operations
article_type: Troubleshooting guide and hypothetical lab
thumbnail: /assets/images/blog/switch-migration-pre-post-checks-thumbnail.webp
image: /assets/images/blog/switch-migration-pre-post-checks-thumbnail.webp
thumbnail_width: 1200
thumbnail_height: 630
image_alt: Conceptual access-switch replacement with unchanged distribution uplink and forwarding evidence checkpoints
tags:
- switch migration pre post checks VLAN STP
- Cisco switching operations
search_terms:
- switch migration pre post checks VLAN STP
- Cisco switch replacement checklist
- switch cutover VLAN checks
- STP root migration validation
- LACP migration precheck
copy_commands: true
related_posts:
- cisco-lacp-etherchannel-not-forming
- cisco-vlan-allowed-not-forwarding
- cisco-native-vlan-mismatch
service_url: /remote-network-infrastructure-support/
cta_title: Need help tracing an infrastructure failure?
cta_text: Share sanitized evidence, the platform version and the intended behavior. Imran Sarwar can assess a scoped infrastructure investigation.
published: true
sitemap: true
primary_keyword: switch migration pre post checks VLAN STP
secondary_keywords:
- Cisco switch replacement checklist
- switch cutover VLAN checks
- STP root migration validation
- LACP migration precheck
---

A configuration backup preserves commands. A migration baseline also needs to preserve the forwarding behavior those commands produced. Before moving cables, agree which VLANs, spanning-tree roles, LACP partners and user transactions must survive the cutover, and which changes are expected because the replacement has a different identity.

**Scope and evidence:** Proposed standalone Catalyst 9300 IOS XE 17.x access-switch replacement in an existing Rapid PVST+ campus. Distribution remains the intended root for VLANs 20, 42 and 99. The uplink is LACP Port-channel1 with two members; VLAN 99 is native. VLAN 42 hosts use gateway `192.0.2.1`. The example is an evidence contract, not an executed migration or a universal replacement configuration. Stacks, StackWise Virtual, SDA, VTP authority, routed uplinks and PoE-critical services require additional design-specific checks.

<span id="define-the-cutover-boundary-and-expected-deltas"></span>

## Define the Switch Migration Port Map and Expected State Changes

Map each old port to a new port, remote device and service. Label both ends physically. Confirm optic compatibility, link speed, PoE budget, licensing, software support, boot configuration and management access before the outage. Keep an independently reachable console and the old switch available in its known state. Saving a backup on the device being removed is not an independent recovery path.

{% include blog-diagram.html src="/assets/images/diagrams/switch-migration-pre-post-checks-topology.svg" scrollable=true alt="Old and replacement access switches attach one at a time to the same distribution root using a two-member LACP uplink carrying VLANs 20,42,99; expected forwarding roles survive the physical move" caption="Hypothetical cutover boundary. Old and new production uplinks are not joined simultaneously; the root and service intent remain stable." %}

| Contract item | Baseline and intended postcheck | Expected difference |
| --- | --- | --- |
| Physical map | Correct peer, speed and assigned access VLAN | Local port numbers can change through an approved map |
| Trunk | 20,42,99 allowed, locally active and forwarding/not pruned as designed | None unless explicitly approved |
| STP | Distribution root, intended access uplink role, no unexpected inconsistencies | Access bridge ID changes with new hardware |
| LACP | Two selected members to the intended remote system | Local system ID and member identifiers can change |
| Services | Management, gateway and named application tests pass | MAC learning/counters restart; evidence needs a convergence window |

A byte-for-byte output diff will flag legitimate identity and counter changes. Conversely, matching configuration lines do not prove that the correct remote peer is connected. This article defines switch-specific acceptance evidence; a collection framework such as the existing pyATS work must still be given these intent rules.

<span id="step-1-collect-a-timestamped-baseline-on-both-ends"></span>

## Capture VLAN, STP and LACP Baselines on Both Uplink Peers

On **the old access switch and distribution peer, read-only privileged EXEC**:

```text
show clock
show version
show inventory
show interfaces status
show interfaces trunk
show vlan brief
show spanning-tree summary
show spanning-tree vlan 42
show spanning-tree inconsistentports
show etherchannel summary
show lacp neighbor
show cdp neighbors detail
```

Store raw outputs securely with device identity, timestamp and command failures; inventory and neighbor detail can expose internal information. A disabled discovery protocol is not proof of a wrong cable—correlate labels and peer-side evidence. Record all in-scope VLANs, not just VLAN 42 because it appears in this example. The command families and platform differences are documented in Cisco's [Catalyst Layer 2/3 command reference](https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-12/command_reference/b_1712_9300_cr/layer_2_3_commands.html).

For each uplink member and its logical interface, record the corresponding running configuration and physical error baseline. For this illustrative naming scheme:

```text
show running-config interface Port-channel1
show running-config interface TenGigabitEthernet1/1/1
show running-config interface TenGigabitEthernet1/1/2
show interfaces counters errors
show logging | include SPANTREE|EC|LACP|ERR
```

The intended result is a forwarding logical bundle with two selected members and the expected partner. Suspended or individual members require explanation before migration; otherwise the replacement inherits an unresolved baseline failure. Cisco's [EtherChannel troubleshooting reference](https://www.cisco.com/c/en/us/support/docs/switches/catalyst-9300-series-switches/220367-troubleshoot-etherchannels-on-catalyst-9.html) explains the negotiation evidence. Running/stored configurations, secrets and recovery images need separate secure backups; do not paste them into public reports.

<span id="step-2-agree-evidence-based-abort-and-acceptance-gates"></span>

## Set Switch Cutover Acceptance, Abort and Rollback Gates

Before the window, choose actual service probes, owners and a rollback deadline that leaves time for safe repatching. The proposed plan checks management access, one authorized host in every critical VLAN, gateway reachability and an actual business service with its return path. Ping alone is insufficient; some services block ICMP while others answer ping despite application failure.

Record the baseline state and expected convergence allowance. Do not invent a universal 30-second convergence promise. Set critical stop conditions: unexpected root ownership, inconsistent ports, wrong LACP partner, missing critical VLAN, loop symptoms, lost management or a failed critical service. An error-counter increase must be interpreted over an interval and link state; do not compare raw lifetime totals across new hardware.

{% include blog-diagram.html src="/assets/images/diagrams/switch-migration-pre-post-checks-flow.svg" scrollable=true alt="Migration decision flow requires complete baseline, intended forwarding state and critical service checks before acceptance; failures trigger investigation or planned rollback" caption="An operational checkpoint must have a named owner and a bounded recovery decision." %}

<span id="step-3-execute-the-reviewed-physical-plan-then-compare-intent"></span>

## Compare Forwarding Intent After the Physical Switch Cutover

**Disruptive change:** the actual configuration staging and cable move require the approved site-specific method of procedure. Isolate the replacement while validating it, confirm VLAN ownership and STP priorities, and move only the labeled connections in the agreed sequence. Never connect an unreviewed second Layer 2 path simply to keep both switches online. Avoid simultaneously advertising duplicate management/SVI addresses.

After the agreed convergence period, rerun the same commands on the new access switch and unchanged distribution peer. Compare intended role, peer and forwarding sets using the old-to-new port map. Verify all three trunk lists and any STP inconsistencies. Check that two members are actually selected in the bundle rather than merely administratively configured. The [allowed-but-not-forwarding guide](/blog/cisco-vlan-allowed-not-forwarding/) and [LACP guide](/blog/cisco-lacp-etherchannel-not-forming/) isolate those failures without disabling protection.

<span id="verify-services-and-make-rollback-concrete"></span>

## Verify Critical Services and Execute an Ordered Switch Rollback

Have service owners repeat the predeclared probes and record actual results. Keep representative test identity, source VLAN, destination, time and expected behavior in the evidence record. Verify management and monitoring still identify the new hardware; new MAC/ifIndex values can require monitoring rediscovery. Check for continuing MAC movement, topology changes or new physical errors after initial convergence.

If a critical gate fails near the recovery deadline, stop speculative edits. Isolate the replacement, restore the labeled old-switch connections and the original peer-side configuration where changed, then verify the old baseline and critical services. Reconnecting the old switch while leaving the new production uplink attached can create a loop or duplicate identity; rollback is an ordered physical plan. Do not erase the replacement or discard evidence before the cause is understood.

Accept only with forwarding and service evidence, then persist approved configurations and update inventory under the change process. Schedule any resilience/failover test separately if it was not explicitly included in the window. The [native VLAN guide](/blog/cisco-native-vlan-mismatch/) covers a specific tagging mismatch; it does not replace a complete migration evidence contract.
