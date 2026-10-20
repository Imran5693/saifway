---
layout: "post"
title: "Cisco SD-WAN Template Out of Sync: What Should You Check Before Reattaching?"
seo_title: "Cisco SD-WAN Template Out of Sync: What Should You Check Before Reattaching?"
description: "Review SD-WAN template out-of-sync evidence using device identity, management model and task status before approving reconciliation or reattachment."
date: "2026-10-20T10:44:27+04:00"
editorial_date: "2026-05-08"
created_date: "2026-10-19"
modified_date: "2026-10-20T10:44:27+04:00"
permalink: "/blog/sdwan-template-out-of-sync/"
author: "Imran Sarwar"
expertise: "automation"
thumbnail: "/assets/images/blog/sdwan-template-out-of-sync.webp"
image: "/assets/images/blog/sdwan-template-out-of-sync.webp"
thumbnail_width: 1536
thumbnail_height: 1024
image_alt: "A router configuration compared with controller intent — conceptual illustration"
article_type: "Practical guide and proposed lab"
topic_label: "Controller and fabric"
review_collection: "automation-2026"
review_draft: false
published: true
sitemap: true
robots: "index, follow"
tags: ["sd wan template out of sync", "vmanage device template sync status", "sdwan configuration drift"]
search_terms: ["sd wan template out of sync", "vmanage device template sync status", "sdwan configuration drift"]
takeaways: ["Out-of-sync status is a starting point, not a diagnosis.", "Classic template APIs do not cover every configuration model.", "Reattaching can change live configuration and needs review."]
related_posts: ["sdwan-api-403-xsrf-token", "catalyst-center-api-task-polling", "python-network-config-drift", "netmiko-readtimeout-troubleshooting", "netmiko-netconf-restconf-python-network-automation"]
service_url: "/network-automation-services/#request-engineering-support"
cta_title: "Need a configuration reconciliation report?"
cta_text: "I can scope a read-only inventory and comparison dashboard using your supported API and sanitized exports. Any template attachment or production correction requires the responsible SD-WAN engineer's review."
---

An SD-WAN device appears out of sync with its template. Reattaching immediately may overwrite a deliberate local adjustment or repeat a failing operation. First establish which management model applies and what the controller and device each report.

**Lab status:** This is a proposed exercise, not a completed device test or client case study. Code examples require validation against your image and dependency versions. Controller/fabric platform access is not confirmed; offline samples demonstrate report logic only. My documented background is NOC/data center operations, multi-vendor Netmiko workflows and Python/Flask integration.

**Offline example checks:** October 20, 2026: the added helper/demo block executed with local fixtures, and related negative cases were checked offline. No live device, controller, fabric or service behavior was validated.

## What does an out-of-sync template status establish?

It indicates a mismatch in the controller's view of configuration synchronization. It does not by itself identify the changed command, why the mismatch occurred or whether a user-facing service is affected. Classic device templates and newer configuration-group workflows need different documentation and APIs.

Keep classic device/feature templates separate from configuration groups and other management models. A controller status flag is one observation, not a normalized configuration diff. Record device ID, management model and collection time before joining records.



## Why inspect the configuration task history before reattaching?

A failed attachment task may explain why intended state was never applied. A successful task followed by drift suggests another sequence. Retain the task reference and sanitized failure category; do not infer chronology from screenshots taken at different times.





{% include blog-diagram.html src="/assets/images/diagrams/sdwan-template-out-of-sync.svg" alt="Compare intent, status and device state" caption="Conceptual diagnostic sequence; no measured outcomes or real device screenshots are shown." %}

## Proposed SD-WAN lab: collect controller and device evidence

Use saved, redacted controller records first. A later live collector needs the exact supported status endpoint and a version-specific schema adapter. Capture the controller view, device readback and related task together. Existing GNS3/EVE-NG access alone does not validate Manager API behavior.



## Python: compare saved configuration text offline

The stronger helper below checks identity/model alignment before treating the normalized status as evidence. Its dictionaries are an application schema, not a claim that Manager returns those exact keys. A missing status or mismatched device stays unknown; no branch reattaches a template.

```python
from pathlib import Path
from difflib import unified_diff

intended = Path("intended.txt").read_text(encoding="utf-8").splitlines()
observed = Path("observed.txt").read_text(encoding="utf-8").splitlines()
for line in unified_diff(intended, observed,
                         fromfile="intended", tofile="observed", lineterm=""):
    print(line)
```


### Worked Python example and input contract

```python


def sync_evidence(controller, device, task):
    if not isinstance(controller, dict) or not isinstance(device, dict) or not isinstance(task, dict):
        return {'state': 'unknown_evidence'}
    keys = ('device_id','management_model')
    if any(not controller.get(k) or controller.get(k) != device.get(k) for k in keys):
        return {'state': 'identity_or_model_mismatch'}
    if controller.get('sync') not in ('in_sync','out_of_sync'):
        return {'state': 'unknown_sync_state'}
    return {'state': 'review_required' if controller['sync']=='out_of_sync' or task.get('failed') is True
            else 'reported_in_sync_requires_readback', 'auto_reattach': False}

controller = {'device_id': 'lab-edge', 'management_model': 'classic_template',
              'sync': 'out_of_sync'}
device = {'device_id': 'lab-edge', 'management_model': 'classic_template'}
print(sync_evidence(controller, device, {'failed': True}))  # Synthetic evidence
```

## How can API collection support sync-status reporting?

Use the release's read-only APIs for status and task details, then map documented identifiers into the application schema. Treat pagination failure or missing rows as incomplete collection. A text diff remains supporting evidence and must not be described as a full controller collector.



## What approvals and comparisons should precede reconciliation?

Before any approved reconciliation, retain both views, the local-change rationale, ownership and rollback criteria. Determine whether a local difference is intentional. Reattachment can overwrite a deliberate device change; a report should request review rather than perform it.



## What should a configuration-drift integration cover?

Deliver a read-only evidence join and review queue with stale/unknown states and task links. The supported version matrix and live acceptance remain separate project work. A mock test verifies the join logic, not template attachment or configuration-group support.





## Related troubleshooting and implementation

Explore the [network automation troubleshooting collection]({{ '/blog/network-automation-troubleshooting/' | relative_url }}) to connect this issue to adjacent workflows. The [Netmiko, NETCONF and RESTCONF comparison]({{ '/blog/netmiko-netconf-restconf-python-network-automation/' | relative_url }}) helps when you are choosing an interface rather than fixing an existing implementation.

## Technical references

- [Cisco get out-of-sync templates API](https://developer.cisco.com/docs/sdwan/get-out-of-sync-templates/)
- [Cisco SD-WAN API documentation](https://developer.cisco.com/docs/sdwan/)
