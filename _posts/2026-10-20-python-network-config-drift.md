---
layout: "post"
title: "Network Configuration Drift with Python: What Does a Config Diff Tell You?"
seo_title: "Network Configuration Drift with Python: What Does a Config Diff Tell You?"
description: "Compare network configuration drift with Python, approved baseline metadata and narrowly scoped normalization that preserves meaningful ACL changes."
date: "2026-10-20T10:44:27+04:00"
editorial_date: "2026-09-17"
created_date: "2026-10-19"
modified_date: "2026-10-20T10:44:27+04:00"
permalink: "/blog/python-network-config-drift/"
author: "Imran Sarwar"
expertise: "automation"
thumbnail: "/assets/images/blog/python-network-config-drift.webp"
image: "/assets/images/blog/python-network-config-drift.webp"
thumbnail_width: 1536
thumbnail_height: 1024
image_alt: "Two configuration snapshots with highlighted changes — conceptual illustration"
article_type: "Practical guide and proposed lab"
topic_label: "Infrastructure diagnostics"
review_collection: "automation-2026"
review_draft: false
published: true
sitemap: true
robots: "index, follow"
tags: ["network configuration drift detection python", "python network config diff", "network configuration compliance dashboard"]
search_terms: ["network configuration drift detection python", "python network config diff", "network configuration compliance dashboard"]
takeaways: ["A difference is not automatically unauthorized drift.", "Never replace a baseline with a failed or empty collection.", "Preserve configuration context and keep secrets out of public reports."]
related_posts: ["netmiko-backup-failed-devices", "pyats-pre-post-change-checks", "napalm-state-compliance-report", "netmiko-readtimeout-troubleshooting", "netmiko-netconf-restconf-python-network-automation"]
service_url: "/network-automation-services/#request-engineering-support"
cta_title: "Need a configuration drift report or dashboard?"
cta_text: "I can scope a read-only backup and comparison workflow with approved baselines, per-device status and review history. Share your device types and existing collection method."
---

A router's configuration changed, but a raw diff does not say whether the change was approved, harmful or simply a generated timestamp. A useful drift workflow combines reliable collection, an approved baseline and a reviewable comparison.

**Lab status:** This is a proposed exercise, not a completed device test or client case study. Code examples require validation against your image and dependency versions. My documented background is NOC/data center operations, multi-vendor Netmiko workflows and Python/Flask integration.

**Offline example checks:** October 20, 2026: the added helper/demo block executed with local fixtures, and related negative cases were checked offline. No live device, controller, fabric or service behavior was validated.

## What is configuration drift relative to an approved baseline?

Drift is a deviation from an agreed intended state. Two snapshots can differ because of an authorized change, dynamic output, formatting or an unplanned adjustment. The tool should expose evidence and context before labeling the difference a fault.

A diff answers whether two accepted text snapshots differ. It cannot infer approval, impact or forwarding behavior. Require matching device identity, platform and configuration source before comparing; startup and running are different sources.



## Why must someone own and approve the baseline?

The baseline needs a named approver, capture time, source and protected version history. Do not automatically promote current text after a comparison, because that would erase unreviewed drift. Retain a reference to the approved artifact separately from subsequent observations.





{% include blog-diagram.html src="/assets/images/diagrams/python-network-config-drift.svg" alt="Compare against an approved baseline" caption="Conceptual diagnostic sequence; no measured outcomes or real device screenshots are shown." %}

## Proposed GNS3/EVE-NG lab: capture reviewable configuration snapshots

Create two sanitized local snapshots first: one with only a known collection timestamp change and one with an ACL action change. Use a disposable router only for a later authorized collection. Keep secrets out of fixtures and never make an operational ACL change merely to create a screenshot.



## Python: compare two saved configurations with difflib

The additional comparator checks snapshot identity and removes only one explicitly reviewed IOS timestamp-banner pattern. It preserves line order, command hierarchy and ACL differences. Store the diff behind restricted access: even a removed line can reveal credentials or internal addressing.

```python
from pathlib import Path
from difflib import unified_diff

baseline = Path("baseline.cfg").read_text(encoding="utf-8")
current = Path("current.cfg").read_text(encoding="utf-8")
if not baseline.strip() or not current.strip():
    raise ValueError("Empty snapshot: review collection before comparing")

diff = list(unified_diff(
    baseline.splitlines(), current.splitlines(),
    fromfile="approved-baseline", tofile="observed-current", lineterm=""
))
print("\n".join(diff) if diff else "No textual difference in supplied snapshots")
```


### Worked Python example and input contract

```python
import difflib
import re

def config_diff(baseline, current):
    # Only one explicitly reviewed IOS collection-banner pattern is ignored.
    def normalize(snapshot):
        if not isinstance(snapshot, dict) or not isinstance(snapshot.get('text'),str) or not snapshot['text'].strip():
            raise ValueError('snapshot_schema')
        return [line.rstrip() for line in snapshot['text'].splitlines()
                if not re.fullmatch(r'! Last configuration change at .+',line)]
    if any(not baseline.get(k) or baseline.get(k) != current.get(k) for k in ('device_id','platform','source')):
        raise ValueError('snapshot_identity_mismatch')
    lines = list(difflib.unified_diff(normalize(baseline),normalize(current),
                                    fromfile='approved_baseline',tofile='current',lineterm=''))
    return {'state': 'review_required' if lines else 'no_text_difference', 'diff': '\n'.join(lines)}

base = {'device_id': 'lab-r1', 'platform': 'ios', 'source': 'running',
        'text': 'ip access-list extended LAB\n permit ip any any\n'}
current = {**base, 'text': 'ip access-list extended LAB\n deny ip any any\n'}
print(config_diff(base, current))  # Synthetic ACL difference must survive
```

## Which normalization rules could hide meaningful changes?

Do not globally sort configuration lines or remove every numeric value. That can hide ACL ordering, route metrics or interface identity. Every normalization rule needs both a noise fixture and a meaningful-change fixture that must survive the rule.



## Dashboard reporting: connect a diff to approval and review

Use states such as collection unknown, comparison unavailable, no text difference and review required. Link a reviewed diff to the change ticket and owner without automatically declaring it malicious or safe. A later service-state check is separate evidence.





## Related troubleshooting and implementation

Explore the [network automation troubleshooting collection]({{ '/blog/network-automation-troubleshooting/' | relative_url }}) to connect this issue to adjacent workflows. The [Netmiko, NETCONF and RESTCONF comparison]({{ '/blog/netmiko-netconf-restconf-python-network-automation/' | relative_url }}) helps when you are choosing an interface rather than fixing an existing implementation.

## Technical references

- [Python difflib unified_diff](https://docs.python.org/3/library/difflib.html#difflib.unified_diff)
- [Netmiko project](https://github.com/ktbyers/netmiko)
