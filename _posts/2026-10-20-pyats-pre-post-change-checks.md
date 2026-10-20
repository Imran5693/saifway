---
layout: "post"
title: "pyATS Pre/Post-Change Checks: What Network State Should You Compare?"
seo_title: "pyATS Pre/Post-Change Checks: What Network State Should You Compare?"
description: "Define pyATS pre/post-change acceptance checks with a testbed skeleton, a proposed Genie collector and offline comparisons of required interface state."
date: "2026-10-20T10:44:27+04:00"
editorial_date: "2025-12-22"
created_date: "2026-10-19"
modified_date: "2026-10-20T10:44:27+04:00"
permalink: "/blog/pyats-pre-post-change-checks/"
author: "Imran Sarwar"
expertise: "automation"
thumbnail: "/assets/images/blog/pyats-pre-post-change-checks.webp"
image: "/assets/images/blog/pyats-pre-post-change-checks.webp"
thumbnail_width: 1729
thumbnail_height: 910
image_alt: "Before and after network snapshots with one changed route — conceptual illustration"
article_type: "Practical guide and proposed lab"
topic_label: "Infrastructure diagnostics"
review_collection: "automation-2026"
review_draft: false
published: true
sitemap: true
robots: "index, follow"
tags: ["cisco upgrade pre post checks python", "pyats genie diff", "network change validation"]
search_terms: ["cisco upgrade pre post checks python", "pyats genie diff", "network change validation"]
takeaways: ["A device coming back online is not a complete post-change test.", "Compare explicit expectations as well as raw differences.", "Treat missing collection as unknown, never as a passing check."]
related_posts: ["napalm-state-compliance-report", "python-network-config-drift", "netmiko-textfsm-returns-string", "netmiko-readtimeout-troubleshooting", "netmiko-netconf-restconf-python-network-automation"]
service_url: "/network-automation-services/#request-engineering-support"
cta_title: "Need repeatable checks around a network change?"
cta_text: "Share the platforms, planned change and required service outcomes. I can assess read-only collection, comparison reports and a small validation dashboard."
---

After a maintenance window, SSH works and the device responds to ping. That is useful evidence, but it does not prove that the required routing neighbors, interfaces and applications recovered. A pre/post workflow starts with the service conditions that must remain true.

**Lab status:** This is a proposed exercise, not a completed device test or client case study. Code examples require validation against your image and dependency versions. My documented background is NOC/data center operations, multi-vendor Netmiko workflows and Python/Flask integration.

**Offline example checks:** October 20, 2026: the added helper/demo block executed with local fixtures, and related negative cases were checked offline. No live device, controller, fabric or service behavior was validated.

## Which service conditions belong in pre/post-change checks?

Choose checks tied to the change: expected neighbors, relevant routes, interface state and a representative service transaction. A full configuration diff alone cannot establish forwarding behavior. Conversely, normal timestamps and counters can produce noise even when service is healthy.

Define required interfaces and their expected status/protocol separately from the baseline. A baseline can already be degraded. Counters and uptime naturally change; a full-text diff should not be the sole gate for routing or service recovery.



## Why define acceptance criteria before the maintenance window?

Write acceptance before collecting the post-change state. For an intentionally modified interface, document the approved difference instead of deleting every changed field. Unknown collection and unsupported parsing must block an automatic pass even if all available fields match.





{% include blog-diagram.html src="/assets/images/diagrams/pyats-pre-post-change-checks.svg" alt="Compare service expectations before and after change" caption="Conceptual diagnostic sequence; no measured outcomes or real device screenshots are shown." %}

## Proposed GNS3/EVE-NG lab: compare baseline and changed state

Create a minimal testbed with one named IOS XE device, an SSH connection and the correct `os: iosxe` value. Keep credentials in the approved local credential mechanism, outside this repository. Validate the parser on the exact image before using its output as a gate.

```yaml
testbed:
  name: proposed-lab
devices:
  r1:
    os: iosxe
    type: router
    connections:
      cli:
        protocol: ssh
        ip: 192.0.2.11
```

This is the connection skeleton, not a credential-complete testbed. Use your installed pyATS/Unicon SSH policy and verified host-key configuration; do not silently accept unknown identities. Record the accepted dependency versions in a lock file.



## Python: compare expected and observed neighbors offline

The added collector uses `device.parse('show ip interface brief')`, then projects only required interface fields. It rejects an unfamiliar parser schema. The comparison helper takes a separately approved expected-state mapping and reports missing data as unknown. The testbed name, connection policy and credential setup must be completed before a live call.

```python
def compare_neighbors(expected, observed):
    if observed is None:
        return {'status': 'unknown', 'reason': 'collection unavailable'}
    missing = sorted(set(expected) - set(observed))
    unexpected = sorted(set(observed) - set(expected))
    return {'status': 'review' if missing or unexpected else 'matches',
            'missing': missing, 'unexpected': unexpected}

print(compare_neighbors(['192.0.2.2'], []))  # Synthetic missing neighbor
print(compare_neighbors(['192.0.2.2'], None))  # Synthetic collection failure
```


### Worked Python example and input contract

```python


def collect_pyats(testbed_path, device_name):
    from genie.testbed import load
    testbed = load(testbed_path)
    device = testbed.devices[device_name]
    try:
        device.connect(log_stdout=False)
        parsed = device.parse('show ip interface brief')
        interfaces = parsed.get('interface')
        if not isinstance(interfaces, dict) or not interfaces:
            raise ValueError('unsupported_or_empty_parser_schema')
        result = {}
        for name, item in interfaces.items():
            if not isinstance(item, dict) or not all(k in item for k in ('status','protocol')):
                raise ValueError('required_interface_fields_missing')
            result[name] = {'status': item['status'], 'protocol': item['protocol']}
        return result
    finally:
        device.disconnect()

def compare_required(expected, observed):
    if not isinstance(expected,dict) or not expected:
        raise ValueError('nonempty_required_state_mapping_needed')
    if observed is None:
        return {'state': 'unknown', 'failed': [], 'missing': sorted(expected)}
    missing = sorted(set(expected)-set(observed))
    failed = sorted(name for name, value in expected.items()
                    if name in observed and observed[name] != value)
    return {'state': 'unknown' if missing else 'fail' if failed else 'pass_required_checks',
            'missing': missing, 'failed': failed}

expected = {'Loopback0': {'status': 'up', 'protocol': 'up'}}
observed = {'Loopback0': {'status': 'administratively down', 'protocol': 'down'}}
print(compare_required(expected, observed))  # Synthetic normalized fixture
# Live, only after completing the approved testbed and SSH policy:
# observed = collect_pyats('testbed.yml', 'r1')
```

## Which checks still require physical infrastructure evidence?

PoE load, optics, stack failover, boot mode and physical forwarding require hardware-specific checks. Mark them out of scope when unavailable rather than displaying a synthetic pass. A device reload or upgrade is not needed to test the offline acceptance logic.



## When should you choose pyATS, Netmiko or a custom parser?

Use Genie where the parser supports the image/command you need, Netmiko where a reviewed CLI adapter is simpler, and a custom parser only with maintained fixtures. Preserve command errors before attempting parsing; empty structured output is not proof of an empty routing table.



## How should a change-validation report present failures?

A client-ready artifact includes raw evidence location, parser version, expected-state file, per-check outcome and unresolved scope. Keep deployment approval with the responsible engineer. The offline comparison can support a Flask report without claiming an executed change window.





## Related troubleshooting and implementation

Explore the [network automation troubleshooting collection]({{ '/blog/network-automation-troubleshooting/' | relative_url }}) to connect this issue to adjacent workflows. The [Netmiko, NETCONF and RESTCONF comparison]({{ '/blog/netmiko-netconf-restconf-python-network-automation/' | relative_url }}) helps when you are choosing an interface rather than fixing an existing implementation.

## Technical references

- [pyATS pre/post-check project](https://developer.cisco.com/codeexchange/github/repo/AntoineOrsoni/pyats-check-os/)
- [pyATS lab guide](https://developer.cisco.com/codeexchange/github/repo/sttrayno/pyATS-Lab-Guide)
