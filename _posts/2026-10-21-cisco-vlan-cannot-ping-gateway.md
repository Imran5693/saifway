---
layout: post
title: 'Cisco VLAN Cannot Ping Gateway: Access, Trunk and SVI Checks'
seo_title: 'Cisco VLAN Cannot Ping Gateway: Trunk and SVI Checks'
description: Troubleshoot a Cisco VLAN that cannot ping its gateway using access-port, trunk, STP and SVI checks, with a scoped correction and rollback example.
date: '2026-01-14T09:00:00+04:00'
author: Imran Sarwar
permalink: /blog/cisco-vlan-cannot-ping-gateway/
expertise: infrastructure
copy_commands: true
topic_label: Cisco switching troubleshooting
article_type: Troubleshooting guide and hypothetical lab
thumbnail: /assets/images/blog/cisco-vlan-cannot-ping-gateway-thumbnail.webp
image: /assets/images/blog/cisco-vlan-cannot-ping-gateway-thumbnail.webp
thumbnail_width: 1200
thumbnail_height: 630
image_alt: Conceptual workstation and switch path showing interrupted and restored VLAN connectivity
tags:
- Cisco VLAN cannot ping gateway
related_posts:
- multi-router-lan-blog
- network-was-not-the-problem-real-noc-troubleshooting
- cisco-lacp-etherchannel-not-forming
service_url: /remote-network-infrastructure-support/
cta_title: Need help isolating an infrastructure failure?
cta_text: Share the affected scope, platform version and sanitized diagnostic evidence. Imran Sarwar can assess the technical fit and scope for remote infrastructure investigation.
published: true
sitemap: true
related_projects:
- title: Campus Area Network design project
  url: /projects/2024-12-10-campus-area-network/
primary_keyword: Cisco VLAN cannot ping gateway
secondary_keywords:
- Cisco VLAN gateway unreachable
- trunk allowed VLAN missing
- SVI up but cannot ping
- VLAN ARP incomplete
search_terms:
- Cisco VLAN cannot ping gateway
- Cisco VLAN gateway unreachable
- trunk allowed VLAN missing
- SVI up but cannot ping
- VLAN ARP incomplete
---

A workstation has an address in the intended VLAN, but its default gateway does not answer. Do not start by adding routes: a gateway in the same subnet first requires a working Layer 2 path and address resolution. Trace the access port, every trunk and the gateway interface before changing anything.


**Scope and evidence:** Hypothetical lab, not a customer incident or captured device output. Documentation addresses are illustrative and must be replaced in an isolated lab. Commands were reviewed against the primary references below; no live switch or domain was tested. Read-only checks come first. Configuration changes require an authorized maintenance window, a saved baseline and a tested management/rollback path.

<span id="symptoms-and-lab-topology"></span>

## Cisco VLAN Gateway Failure: Symptoms and Lab Topology

This guide uses Catalyst IOS XE 17.x syntax, with the 17.15 Catalyst 9300 guides as the reference baseline. It is not NX-OS syntax. The lab workstation is `192.0.2.10/24`, gateway `192.0.2.1` on DIST1 Vlan20, access port ACCESS1 Gi1/0/10 and a single standalone Gi1/0/48 trunk between switches. VLAN 20 is tagged on that trunk. Native VLAN settings already agree. There is no port-channel in this example.

The specific injected fault is VLAN 20 missing from ACCESS1's explicit trunk allowed list. Other clients in other VLANs can still work. A failed ping alone does not prove this fault; ICMP filtering or a wrong endpoint mask can produce similar symptoms.

{% include blog-diagram.html src="/assets/images/diagrams/cisco-vlan-cannot-ping-gateway.svg" alt="VLAN 20 workstation reaches ACCESS1 but its trunk excludes VLAN 20; after adding VLAN 20 the path reaches DIST1 gateway" scrollable=true caption="Hypothetical topology. The only changed variable is the ACCESS1 trunk allowed list." %}

<span id="step-1-establish-endpoint-scope"></span>

## Check the Client IP Address, Subnet Mask and Gateway ARP

On a Windows 11 lab endpoint, run these read-only checks in PowerShell. Elevation is normally unnecessary for these checks.

```powershell
Get-NetIPConfiguration
ping 192.0.2.1
Get-NetNeighbor -AddressFamily IPv4
```

The first command should show the active adapter with `192.0.2.10`, prefix length 24 and gateway `192.0.2.1`. A different mask, duplicate address indication or wrong interface means the endpoint needs investigation before switch changes. Ping success establishes ICMP reachability only. After an attempted ping, a gateway neighbor with a resolved link-layer address shows address resolution; `Incomplete` or `Unreachable` directs you toward VLAN transport, gateway availability or filtering of ARP. A resolved neighbor with a failed ping calls for gateway ICMP/control-plane policy checks rather than an assumed trunk fault.

<span id="step-2-inspect-access-trunk-and-svi-evidence"></span>

## Verify Cisco Access VLAN, Trunk, STP and SVI State

Run the following in privileged EXEC on the indicated switches. They do not change configuration. Interface names must match the actual hardware.

```text
! ACCESS1
show interfaces status
show interfaces gigabitEthernet1/0/10 switchport
show vlan brief
show interfaces trunk
show spanning-tree vlan 20
show mac address-table dynamic vlan 20
! DIST1
show interfaces vlan 20
show ip interface vlan 20
show interfaces trunk
show spanning-tree vlan 20
show mac address-table dynamic vlan 20
```

| Check | Healthy evidence | Abnormal finding and next action |
| --- | --- | --- |
| Interface status | Client and uplink connected | Not connected: inspect cable, transceiver and endpoint. Err-disabled: identify the recorded cause before recovery. |
| Access switchport | Operational access mode, access VLAN 20 | Wrong VLAN or negotiated trunk: compare intended port profile; do not reconfigure an unidentified uplink. |
| VLAN database | VLAN 20 active on both switches | Missing/suspended VLAN: investigate VLAN management/VTP ownership before creating it. |
| Trunk output | Uplink trunking; 20 in allowed, active and forwarding/not-pruned sections | Missing from allowed list: candidate fault. Allowed but not active: inspect VLAN existence. Active but not forwarding: inspect STP/pruning. |
| STP | Intended path forwarding for VLAN 20 | Blocking can be correct in a redundant topology. Do not disable STP to make a test pass. |
| MAC learning | Endpoint MAC on access port, then on DIST1 uplink after traffic | Learned on wrong port or moving repeatedly: inspect cabling, endpoint attachment or loops. |
| Gateway SVI | Vlan20 up/up with 192.0.2.1/24 | Down/admin down or wrong address: inspect SVI configuration and active Layer 2 members. An up/up SVI alone does not prove every trunk carries 20. |
| SVI IP details | Intended IP and documented access lists | Unexpected ACL: compare policy and counters with the affected flow; do not remove it blindly. |

An SVI generally needs the VLAN active and an eligible forwarding Layer 2 member as well as being administratively enabled. Platform features can alter autostate behavior. In this example DIST1 can retain an up/up SVI through another active member while ACCESS1 still cannot reach it. IP routing is needed for traffic between subnets; enabling it is not the fix for a host trying to reach its own on-link SVI.

<span id="step-3-prove-the-root-cause-before-changing-the-trunk"></span>

## Confirm a Missing Trunk VLAN Before Changing Configuration

Record the original stanza with this read-only privileged EXEC command on ACCESS1:

```text
show running-config interface gigabitEthernet1/0/48
```

Expected healthy configuration permits the intended VLANs. For this lab, assume the baseline explicit allowed list is `10,30`, while DIST1 already permits `10,20,30`. The evidence is specific: VLAN 20 exists, the endpoint is in VLAN 20, the uplink is trunking, and ACCESS1 excludes 20. If these observations do not match, stop and pursue the failed row in the table.

<span id="resolution-add-only-the-missing-vlan"></span>

## Add the Missing VLAN Without Replacing the Trunk Allowed List

**Configuration-changing, ACCESS1 only.** Confirm this interface is the documented standalone trunk. On an EtherChannel, assess the logical port-channel and member consistency instead; see the [LACP guide](/blog/cisco-lacp-etherchannel-not-forming/). Adding a VLAN extends its broadcast/security domain, so verify the intended design and change authorization.

```text
configure terminal
interface gigabitEthernet1/0/48
switchport trunk allowed vlan add 20
end
```

`add 20` preserves the existing list. A bare replacement list could accidentally remove working VLANs. This correction assumes VLAN 20 already exists on both switches and is already permitted at DIST1. It does not change native VLAN, STP or routing.

Rollback for this exact baseline is the following configuration change. Use it only when 20 was absent before this change; otherwise restore the recorded original configuration.

```text
configure terminal
interface gigabitEthernet1/0/48
switchport trunk allowed vlan remove 20
end
```

<span id="verify-restored-connectivity-and-unrelated-services"></span>

## Verify Gateway Connectivity and Other VLAN Services

Repeat `show interfaces trunk` and `show spanning-tree vlan 20` on both switches. VLAN 20 should now be allowed, active and forwarding on the intended path. Repeat the MAC table command: DIST1 should learn the endpoint through the uplink after traffic. Repeat the endpoint ping and neighbor checks: the gateway address should resolve and ICMP should succeed if permitted. If it does not, return to SVI addressing, endpoint mask and policy checks; do not widen the trunk further without evidence.

Test a known service in VLANs 10 and 30 to catch regression, then test the actual affected application. A gateway ping does not prove inter-VLAN routing, DNS or application access. Save with `copy running-config startup-config` only after acceptance; this privileged EXEC command writes persistent configuration. Preserve the reviewed baseline separately.

<span id="prevent-recurrence-and-continue-investigation"></span>

## Prevent Cisco VLAN Gateway Failures During Switch Changes

Maintain a VLAN-to-uplink matrix and compare allowed lists before and after switch replacement. Record STP roles and SVI state in change validation. Pair this guide with the existing [port security lab](/2025/05/15/multi-router-lan-blog.html) when the access interface is err-disabled, and use the [NOC workflow](/2026/05/24/network-was-not-the-problem-real-noc-troubleshooting.html) to establish scope before escalation.

<span id="primary-references"></span>

## Cisco VLAN and Switchport Documentation

- [Cisco IOS XE 17.15 Catalyst 9300 VLAN configuration guide](https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-15/configuration_guide/vlan/b_1715_vlan_9300_cg.pdf): VLAN creation, trunk allowed-list semantics and verification.
- [Cisco IOS XE 17.15 interface command reference](https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-15/command_reference/b_1715_9300_cr/interface_and_hardware_commands.html): switchport state interpretation.
