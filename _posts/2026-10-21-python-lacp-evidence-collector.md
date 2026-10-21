---
layout: post
title: 'Python LACP Port-Channel Health Check: Expected Members and Parser Errors'
seo_title: 'Python LACP Health Check: Members and Parser Errors'
description: Compare expected LACP members with observed IOS XE output while keeping collection and parser errors separate, using a read-only contract and offline tests.
date: '2026-03-12T09:00:00+04:00'
author: Imran Sarwar
permalink: /blog/python-lacp-evidence-collector/
expertise: infrastructure
topic_label: Python switching diagnostics
article_type: Troubleshooting guide and hypothetical lab
thumbnail: /assets/images/blog/python-lacp-evidence-collector-thumbnail.webp
image: /assets/images/blog/python-lacp-evidence-collector-thumbnail.webp
thumbnail_width: 1200
thumbnail_height: 630
image_alt: Conceptual read-only LACP collector comparing expected and observed members with a separate parser-error result
tags:
- Python LACP port channel health check
- Python switching diagnostics
search_terms:
- Python LACP port channel health check
- Python EtherChannel summary parser
- LACP missing member report
- read only switch evidence collector
- port channel parser failure
copy_commands: true
related_posts:
- cisco-lacp-etherchannel-not-forming
- switch-migration-pre-post-checks
- python-snmp-poller-outcomes
service_url: /remote-network-infrastructure-support/
cta_title: Need help tracing an infrastructure failure?
cta_text: Share sanitized evidence, the platform version and the intended behavior. Imran Sarwar can assess a scoped infrastructure investigation.
published: true
sitemap: true
modified_date: '2026-10-21T18:08:00+04:00'
primary_keyword: Python LACP port channel health check
secondary_keywords:
- Python EtherChannel summary parser
- LACP missing member report
- read only switch evidence collector
- port channel parser failure
last_modified_at: '2026-10-21T18:08:00+04:00'
---

A collector that returns an empty member list after a parser error can falsely report a broken EtherChannel. A collector that treats any visible member as healthy can miss a lost link. Preserve collection status, parsing status and expected-versus-observed membership separately.

**Scope and evidence:** Python 3.10+ with a deliberately narrow IOS XE `show etherchannel summary` text contract. Invalid or duplicate expected members return `contract_error` before observed output is interpreted. Expected group is `Po1`, protocol LACP, Layer 2 operational flags `SU`, and members `Gi1/0/1` and `Gi1/0/2`, each bundled with `(P)`. The code accepts a trusted read-only command adapter or saved text; it contains no SSH credentials or configuration commands. Fixtures are synthetic, not captured output. NX-OS, routed port-channels, stacks and differing output formats need their own parser and expected contract.

<span id="define-expected-identity-and-parser-boundaries"></span>

## Define Expected LACP Members and the IOS XE Output Contract

Record the intended device, group, member names and partner evidence outside the collector. Abbreviated interface names must match the validated output format; the example does not guess equivalence between `Gi` and `GigabitEthernet`. `Po1(SU)` and two `(P)` flags establish only observed summary state. They do not prove the remote partner, trunk forwarding, VLAN access or service health. Cisco's [EtherChannel troubleshooting guide](https://www.cisco.com/c/en/us/support/docs/switches/catalyst-9300-series-switches/220367-troubleshoot-etherchannels-on-catalyst-9.html) supplies the device-side interpretation.

{% include blog-diagram.html src="/assets/images/diagrams/python-lacp-evidence-collector-topology.svg" scrollable=true alt="Expected Po1 has Gi1/0/1 and Gi1/0/2 bundled; collector reports a missing second member separately from collection and parser errors" caption="Synthetic evidence contract. The collector never attempts to add members or change channel configuration." %}

<span id="a-narrow-parser-that-fails-explicitly"></span>

## Python Example: Parse EtherChannel Summary with Explicit Errors

Save this **Python code** as `lacp_evidence.py`. Defining it does not connect to a switch. The parser recognizes one IOS-style summary row and member-only continuation lines; pagination, command errors, duplicate members and unknown trailing text are rejected instead of silently discarded.

```python
import re

ROW = re.compile(r"^\s*\d+\s+(Po\d+)\(([^)]+)\)\s+(\S+)\s+(.*)$")
PORT = re.compile(r"([A-Za-z][A-Za-z0-9/.-]*)\(([A-Za-z]+)\)")

def evaluate(raw, expected):
    if not isinstance(expected, dict) or not re.fullmatch(r"Po[0-9]+", str(expected.get("channel", ""))):
        return {"status": "contract_error", "reason": "invalid channel contract"}
    wanted_list = expected.get("members")
    if (not isinstance(wanted_list, list) or not wanted_list
            or not all(isinstance(p, str) and re.fullmatch(r"[A-Za-z][A-Za-z0-9/.-]*", p) for p in wanted_list)
            or len(set(wanted_list)) != len(wanted_list)):
        return {"status": "contract_error", "reason": "invalid expected members"}
    if not isinstance(raw, str) or "--More--" in raw or re.search(r"^\s*%", raw, re.M):
        return {"status": "parse_error", "reason": "invalid or incomplete output"}
    header = None
    tails = []
    for line in raw.splitlines():
        match = ROW.match(line)
        if match:
            if header is not None:
                break
            if match[1] == expected["channel"]:
                header = (match[2], match[3])
                tails.append(match[4])
        elif header is not None and line.strip():
            tails.append(line.strip())
    if header is None:
        return {"status": "parse_error", "reason": "target row not recognized"}
    tail = " ".join(tails)
    pairs = PORT.findall(tail)
    if not pairs or PORT.sub("", tail).strip():
        return {"status": "parse_error", "reason": "member format not recognized"}
    if len({name for name, flag in pairs}) != len(pairs):
        return {"status": "parse_error", "reason": "duplicate member"}
    members = dict(pairs)
    wanted = set(expected["members"])
    missing = sorted(wanted - members.keys())
    unexpected = sorted(members.keys() - wanted)
    not_bundled = sorted(name for name, flag in pairs if flag != "P")
    healthy = (header == ("SU", "LACP") and not missing
               and not unexpected and not not_bundled)
    return {"status": "healthy_observed" if healthy else "mismatch",
            "channel": expected["channel"], "flags": header[0],
            "protocol": header[1], "members": members,
            "missing": missing, "unexpected": unexpected,
            "not_bundled": not_bundled}

def collect(send_command, expected):
    try:
        raw = send_command("show etherchannel summary")
    except Exception as error:
        return {"status": "collection_error", "error_type": type(error).__name__}
    return evaluate(raw, expected)
```

A missing target row is reported as unrecognized evidence, not proof that the device has no channel. Likewise a command permission error is not a missing member. Keep the original timestamped output securely beside the structured result for review. The broad exception boundary here reports adapter failure without inventing device state; authentication, authorization and transport details should remain typed and sanitized in the real adapter.

<span id="offline-expected-versus-observed-fixtures"></span>

## Test Missing and Suspended LACP Members Using Offline Fixtures

Append these **synthetic fixtures** and run `python lacp_evidence.py`. They call only local functions:

```python
if __name__ == "__main__":
    expected = {"channel": "Po1", "members": ["Gi1/0/1", "Gi1/0/2"]}
    healthy = "1 Po1(SU) LACP Gi1/0/1(P) Gi1/0/2(P)"
    missing = "1 Po1(SU) LACP Gi1/0/1(P)"
    suspended = "1 Po1(SU) LACP Gi1/0/1(P) Gi1/0/2(s)"
    assert evaluate(healthy, expected)["status"] == "healthy_observed"
    assert evaluate(missing, expected)["missing"] == ["Gi1/0/2"]
    assert evaluate(suspended, expected)["not_bundled"] == ["Gi1/0/2"]
    assert evaluate("% Invalid input", expected)["status"] == "parse_error"
    assert collect(lambda command: healthy, expected)["status"] == "healthy_observed"
    print("5 offline fixtures passed")
```

Expected output is `5 offline fixtures passed`. The result does not validate real IOS text, SSH transport or partner selection. Capture representative authorized outputs from each supported platform/build and add fixtures for continuation lines, unknown text and error states before operational use. A structured vendor/API parser can be preferable to extending this intentionally small regular expression indefinitely.

{% include blog-diagram.html src="/assets/images/diagrams/python-lacp-evidence-collector-flow.svg" scrollable=true alt="Decision flow separates collection completion, recognized summary and expected members before reporting observed health or mismatch" caption="Parser failure produces an unknown evidence state, never an empty healthy bundle." %}

<span id="attach-only-an-approved-read-only-collector"></span>

## Connect an Approved Read-Only LACP Command Collector

**Collection rollout change:** save the existing collector/template and pilot one expected group. Supply a trusted adapter with a fixed command allowlist, bounded connect/read deadlines, host-key verification and a least-privilege account. Disable pagination through the adapter's reviewed session handling; do not leave a CLI prompt or pager in the raw command response. Never pass arbitrary user-supplied command strings to the device. A transport package's successful return is not proof of complete output; reject truncation and retain command completion metadata.

The callback design keeps the article independent of a specific changing SSH library. An existing Netmiko or pyATS workflow can provide the command output, but its platform driver and exception behavior must be validated separately. No working live adapter is claimed here. The [SNMP outcome guide](/blog/python-snmp-poller-outcomes/) shows the same separation of collection failure from missing data for another protocol.

<span id="verify-operational-evidence-and-keep-rollback-local-to-the-collector"></span>

## Verify LACP Evidence and Roll Back the Collector Template

Compare a pilot's structured result with an authorized manual `show etherchannel summary`, then check partner identity with `show lacp neighbor` and VLAN forwarding on the logical interface. If a member is missing or suspended, follow the [LACP troubleshooting guide](/blog/cisco-lacp-etherchannel-not-forming/); the collector must not repair it automatically.

Rollback disables the pilot job and restores the saved reporting template. No switch configuration rollback is needed because this collector issues no configuration command. Preserve parser-error records as unknown and alert on persistent collection failure instead of rendering it as success. During a cutover, use the [migration evidence contract](/blog/switch-migration-pre-post-checks/) to decide which observed differences are intended and which require an owner decision.
