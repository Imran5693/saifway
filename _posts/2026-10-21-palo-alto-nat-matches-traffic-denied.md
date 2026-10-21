---
layout: post
title: 'Palo Alto NAT Matches but Traffic Is Denied: DNAT Security Checks'
seo_title: 'Palo Alto NAT Matches but Traffic Denied: DNAT Checks'
description: Troubleshoot Palo Alto DNAT traffic denied by security policy using original addresses, post-NAT destination zones, rule tests and real session evidence.
date: '2026-08-14T09:00:00+04:00'
author: Imran Sarwar
permalink: /blog/palo-alto-nat-matches-traffic-denied/
expertise: infrastructure
topic_label: Firewall troubleshooting
article_type: Troubleshooting guide and hypothetical lab
thumbnail: /assets/images/blog/palo-alto-nat-matches-traffic-denied-thumbnail.webp
image: /assets/images/blog/palo-alto-nat-matches-traffic-denied-thumbnail.webp
thumbnail_width: 1200
thumbnail_height: 630
image_alt: Conceptual client, firewall and server with a blocked permission gate and corrected traffic path
tags:
- Palo Alto NAT matches traffic denied
- PAN-OS destination NAT
- post-NAT zone
search_terms:
- Palo Alto NAT matches traffic denied
- Palo Alto DNAT security rule
- pre NAT destination address
- post NAT destination zone
- test security-policy-match DNAT
copy_commands: true
related_posts:
- network-was-not-the-problem-real-noc-troubleshooting
- cisco-vlan-cannot-ping-gateway
- designing-resilient-security-architectures
service_url: /remote-network-infrastructure-support/
cta_title: Need help tracing a firewall traffic decision?
cta_text: Share the sanitized original and translated tuple, relevant zones, rule matches and session evidence. Imran Sarwar can assess the fit and scope of an authorized infrastructure investigation.
published: true
sitemap: true
primary_keyword: Palo Alto NAT matches traffic denied
secondary_keywords:
- Palo Alto DNAT security rule
- pre NAT destination address
- post NAT destination zone
- test security-policy-match DNAT
---

A matching NAT rule does not grant permission to pass traffic. For destination NAT, a security rule can miss because it uses the translated server address instead of the original destination, or because it references the wrong destination zone. Trace the tuple through routing, NAT selection and security evaluation before widening a rule.

**Scope and evidence:** Hypothetical standalone PAN-OS 11.2 firewall, one virtual system and virtual router `default`. Commands are PAN-OS syntax, not Cisco ACL syntax. No live firewall, successful commit or customer incident is claimed. Validate the installed release and admin role; Panorama-managed rules and multi-vsys contexts require their own ownership/context checks.

<span id="symptoms-and-the-dnat-example"></span>

## Palo Alto DNAT Denied Traffic: Symptoms and Lab Flow

Client `192.0.2.50` connects to published address `192.0.2.100:443`. Firewall ethernet1/1 is `192.0.2.1/24` in `untrust`; ethernet1/2 is `198.51.100.1/24` in `dmz`. An existing DNAT rule maps `192.0.2.100:443` to server `198.51.100.10:443`. The server's gateway is `198.51.100.1`. There is no source NAT or port translation in this example. All addresses are documentation examples used on isolated lab segments.

The existing security rule `allow-published-https` permits source `192.0.2.50`, zones `untrust` to `dmz`, application `ssl`, service `application-default`, with the intended security profiles. Its sole fault is destination **198.51.100.10**, the translated address, instead of original destination **192.0.2.100**. A lower logged interzone deny rule makes the miss observable in this lab. Check actual logging settings in a real environment; not every default deny is logged automatically.

{% include blog-diagram.html src="/assets/images/diagrams/palo-alto-nat-matches-traffic-denied-topology.svg" scrollable=true alt="Client connects to published address 192.0.2.100 and DNAT selects server 198.51.100.10 in dmz; the security destination is corrected from the server address to the original published address" caption="Hypothetical DNAT path. The NAT mapping stays fixed; only the existing security rule's destination selector changes." %}

<span id="step-1-write-down-both-tuples-and-the-two-destination-zones"></span>

## Map Original and Translated Addresses to NAT and Security Zones

Do not infer the entire flow from a rule hit count. Use the original client's source, destination, protocol/port, ingress zone, translated destination and resulting egress zone. The source may differ from a user's workstation if a proxy or upstream translation intervenes.

| Evaluation | Source / destination addresses | Zones for this lab | What a match establishes |
| --- | --- | --- | --- |
| Original packet | `192.0.2.50` → `192.0.2.100:443` | Ingress `untrust` | The tuple the firewall must actually receive |
| NAT policy selection | Original addresses | `untrust` → `untrust`, from the original-destination route lookup | Which translation rule is selected; not security permission |
| Translated server path | Destination becomes `198.51.100.10:443` | Server route leads to `dmz` | Where the translated packet would be forwarded if allowed |
| Security policy match | Original source and original destination | `untrust` → `dmz` | Permission for the supplied context, subject to runtime inspection/enforcement |

For DNAT, Palo Alto's documented distinction is original addresses with the post-translation destination zone for security rules. NAT policy uses the original-destination route lookup for its destination zone. This lab's original published address lies on the connected untrust subnet. A different topology can produce a different NAT destination zone; do not hard-code `untrust` for every inbound rule. See the [vendor's one-to-one DNAT example](https://docs.paloaltonetworks.com/ngfw/networking/nat/destination-nat-exampleone-to-one-mapping).

<span id="step-2-check-routes-and-predict-the-selected-rules"></span>

## Test PAN-OS Routes, NAT Match and Security Policy Match

Run these **non-mutating operational-mode** commands with an authorized role. Tests predict matches for the supplied tuple; they do not send a real HTTPS session or prove a server response.

```text
show routing route
test nat-policy-match from untrust to untrust source 192.0.2.50 destination 192.0.2.100 protocol 6 destination-port 443
test security-policy-match from untrust to dmz source 192.0.2.50 destination 192.0.2.100 protocol 6 destination-port 443 application ssl
show running nat-policy
show running security-policy
```

| Check | Expected healthy evidence | Abnormal result and next action |
| --- | --- | --- |
| Routes | Original address resolves through untrust; translated server subnet through dmz | Wrong virtual router, route or egress: fix the intended routing design before assuming a rule-address fault. |
| NAT match test | Intended publication/DNAT rule | Another rule or no match: compare original tuple, service and ordering. Security edits will not correct wrong translation selection. |
| Security match test | Intended allow rule with original destination and `dmz` zone | Lab fault selects the lower deny rule. Compare destination address, zones, order, application/service and other rule constraints. |
| Running policy views | Committed rule content/order agrees with the test assumptions | Candidate edits or centrally managed policy may differ. Identify the active configuration and owner before making a local change. |

Specifying `application ssl` checks that supplied application context. It does not reproduce the full App-ID evolution, decryption, profile action, user identity or session lifecycle of a live connection. Use the correct context for the actual failure rather than adjusting a test until it returns an allow rule.

<span id="step-3-correlate-the-actual-traffic-decision"></span>

## Correlate PAN-OS Traffic Logs and Actual Session Decisions

Generate one approved test connection from the lab client and inspect **Monitor → Traffic** for its time, original addresses, destination port, zones, rule, action and session-end reason. Add translated-address columns or session detail where available. Confirm logging is enabled for the relevant rules before concluding that absence of a log means absence of traffic.

This operational command looks for matching sessions:

```text
show session all filter source 192.0.2.50 destination 192.0.2.100 destination-port 443
```

A matching active session lets you inspect its actual observed ID with `show session id` followed by that numeric ID. Compare original/translated addresses, security rule and counters. A denied or short-lived session may already be absent; correlate the Traffic log rather than assuming the session search must find every attempt. These are inspection operations, not session clears.

Distinguish a policy deny from allowed traffic later blocked by a threat/profile action, decryption failure, missing return path or non-listening server. If no client packet reaches the firewall, investigate upstream routing, ARP/proxy-ARP and delivery of the published address first. A NAT match test alone does not prove those prerequisites work.

{% include blog-diagram.html src="/assets/images/diagrams/palo-alto-nat-denied-diagnostic-flow.svg" scrollable=true alt="Decision flow checks packet arrival, intended NAT match and intended security allow before investigating runtime inspection and return traffic" caption="Use actual logs/session evidence alongside predictive tests. Translation selection and traffic permission are separate decisions." %}

<span id="resolution-replace-the-confirmed-wrong-destination-selector"></span>

## Correct the Confirmed DNAT Security Destination Selector

**Configuration-changing and commit-dependent.** This example applies only to the existing local rule and its single recorded destination member. Review rule order, source restriction, `dmz` destination zone, application/service and profiles first. Export/record the known configuration baseline and coordinate a configuration lock/change window. A full commit can include other administrators' pending changes: review the entire candidate diff and commit scope before applying anything in production.

In the isolated lab, replace the single wrong destination; do not add a broad `any` permit:

```text
configure
delete rulebase security rules allow-published-https destination 198.51.100.10
set rulebase security rules allow-published-https destination 192.0.2.100
show rulebase security rules allow-published-https
commit
exit
```

`delete` removes the recorded old list member; `set` adds the original published address. A bare `set` without removal could leave both destinations in the list. The configuration-mode `show` reviews the resulting candidate rule. Commit applies the reviewed change; confirm its job succeeds. Do not commit an incomplete intermediate list or treat an uncommitted candidate edit as active enforcement.

For this exact baseline, rollback is another reviewed configuration change:

```text
configure
delete rulebase security rules allow-published-https destination 192.0.2.100
set rulebase security rules allow-published-https destination 198.51.100.10
commit
exit
```

This restores the intentionally broken lab selector. Production recovery must restore an approved working state; rollback of a rule also does not guarantee existing sessions are reevaluated in the way a new connection is. Do not clear all sessions to simplify a test.

<span id="verify-a-new-connection-and-its-return-path"></span>

## Verify a New DNAT Connection and Server Return Traffic

After successful commit, repeat the NAT and security match tests and inspect running policy. NAT should still select the same mapping; the security test should now select `allow-published-https` for the intended context. Start a **new** approved client connection and correlate its actual allow rule, translated destination, application, security result and response traffic.

The server must listen on 443 and return through the expected firewall path. Verify the intended page/API response and certificate behavior, not just a SYN or a policy-test allow. Check unrelated publications remain unchanged. If traffic is allowed but fails later, follow the actual session-end reason instead of widening this rule further.

<span id="prevention-and-references"></span>

## Prevent NAT and Security Rule Mismatches: Vendor References

Keep an original/translated tuple worksheet with both route-derived destination zones. Validate NAT and security independently during publication changes. The [NOC workflow](/2026/05/24/network-was-not-the-problem-real-noc-troubleshooting.html) helps identify the first failed dependency; the [security architecture article](/2026/02/16/designing-resilient-security-architectures.html) provides broader control-design context.

- [Palo Alto Networks: NAT policy rules](https://docs.paloaltonetworks.com/ngfw/networking/nat/nat-policy-rules).
- [Palo Alto Networks: one-to-one destination NAT](https://docs.paloaltonetworks.com/ngfw/networking/nat/destination-nat-exampleone-to-one-mapping).
- [PAN-OS 11.2 operational CLI hierarchy](https://docs.paloaltonetworks.com/ngfw/pan-os-cli-quick-start/cli-command-hierarchy/pan-os-11-2-cli-ops-command-hierarchy), for policy tests and operational command syntax.
- [Palo Alto Networks: create and verify a security policy rule](https://docs.paloaltonetworks.com/network-security/security-policy/administration/security-rules/create-a-security-policy-rule).
