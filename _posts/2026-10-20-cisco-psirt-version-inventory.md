---
layout: "post"
title: "Cisco PSIRT Reporting with Python: What Inventory Data Do You Need?"
seo_title: "Cisco PSIRT Reporting with Python: What Inventory Data Do You Need?"
description: "Prepare Cisco PSIRT review reports from version inventory and saved advisory exports, preserving missing data and manual applicability decisions."
date: "2026-10-20T10:44:27+04:00"
editorial_date: "2025-12-17"
created_date: "2026-10-19"
modified_date: "2026-10-20T10:44:27+04:00"
permalink: "/blog/cisco-psirt-version-inventory/"
author: "Imran Sarwar"
expertise: "automation"
thumbnail: "/assets/images/blog/cisco-psirt-version-inventory.webp"
image: "/assets/images/blog/cisco-psirt-version-inventory.webp"
thumbnail_width: 1728
thumbnail_height: 910
image_alt: "Network version inventory connected to security advisory review — conceptual illustration"
article_type: "Practical guide and proposed lab"
topic_label: "Infrastructure diagnostics"
review_collection: "automation-2026"
review_draft: false
published: true
sitemap: true
robots: "index, follow"
tags: ["python cisco ios xe vulnerability checker", "Cisco PSIRT API", "network patch readiness report"]
search_terms: ["python cisco ios xe vulnerability checker", "Cisco PSIRT API", "network patch readiness report"]
takeaways: ["Version matching is a triage input, not proof of exploitability.", "Missing or unsupported data must remain unknown.", "Patch selection needs platform and operational review."]
related_posts: ["pyats-pre-post-change-checks", "netmiko-backup-failed-devices", "napalm-state-compliance-report", "netmiko-readtimeout-troubleshooting", "netmiko-netconf-restconf-python-network-automation"]
service_url: "/network-automation-services/#request-engineering-support"
cta_title: "Need a clearer network patch inventory?"
cta_text: "Share the inventory format, device families and reporting requirement. I can assess collection, advisory-data integration and a review dashboard; security decisions remain with the authorized owner."
---

A spreadsheet of software versions helps only if someone can connect each row to the correct platform and advisory. Python can make that evidence easier to collect and review. It should not turn an uncertain version match into an automatic declaration that a device is safe or vulnerable.

**Lab status:** This is a proposed exercise, not a completed device test or client case study. Code examples require validation against your image and dependency versions. My documented background is NOC/data center operations, multi-vendor Netmiko workflows and Python/Flask integration.

**Offline example checks:** October 20, 2026: the added helper/demo block executed with local fixtures, and related negative cases were checked offline. No live device, controller, fabric or service behavior was validated.

## Which inventory fields support a Cisco PSIRT review?

Capture device identity, model, operating system, exact version string and collection time. Preserve the raw source because normalizing a train or suffix incorrectly can change a match. Separate an unreachable device from a device whose version was collected but could not be mapped.

Keep raw version text, a reviewed query-version field, product family, device ID, collection timestamp and query timestamp. Do not remove release suffixes heuristically. If the inventory cannot identify a release exactly, route it to manual review rather than sending a guessed version to an advisory matcher.



## Why is a software-version match not a vulnerability verdict?

At this review, Cisco's `/iosxe` documentation labels that route as a sunset endpoint. Verify the current supported API/product query and OAuth entitlement before implementing live retrieval. This article therefore supplies a saved-export reporting adapter, not an assumed working API client. Record query version and retrieval time with each export; `no matches` is not a device-security clearance.





{% include blog-diagram.html src="/assets/images/diagrams/cisco-psirt-version-inventory.svg" alt="From software inventory to a reviewed patch decision" caption="Conceptual diagnostic sequence; no measured outcomes or real device screenshots are shown." %}

## Proposed lab: collect inventory evidence for advisory review

First save inventory from read-only `show version` collection on an image you can access. For the advisory portion, use a permitted API export with its original retrieval metadata; synthetic fixtures must say `SYNTHETIC` and remain outside client findings. Never submit complete configurations or credentials to an advisory endpoint.



## Python: preserve missing version data in the report

The report function below joins retained API results only when the exact queried version matches the inventory version. Missing query data, unknown versions and empty advisory lists receive different states. CSV is useful for analyst review; the helper does not select an upgrade release or evaluate feature exposure.

```python
inventory = [
    {'device': 'lab-r1', 'platform': 'IOS XE', 'version': 'example-release'},
    {'device': 'lab-r2', 'platform': 'IOS XE', 'version': None},
]
report = []
for item in inventory:
    status = 'ready_for_advisory_query' if item.get('version') else 'unknown_version'
    report.append({**item, 'status': status, 'applicability': 'not_reviewed'})
print(report)
```


### Worked Python example and input contract

```python
import csv
import io

def advisory_rows(inventory, responses):
    # responses is a device-ID keyed mapping of retained, authorized API exports.
    rows = []
    for item in inventory:
        device, version = item['device'], item.get('version')
        saved = responses.get(device)
        state, ids = 'unknown_version', []
        if version:
            state = 'query_unavailable'
            if isinstance(saved, dict) and saved.get('queried_version') == version:
                advisories = saved.get('advisories')
                if isinstance(advisories, list) and all(isinstance(a, dict) and
                        isinstance(a.get('advisoryId'), str) for a in advisories):
                    ids = sorted({a['advisoryId'] for a in advisories})
                    state = 'review_required' if ids else 'no_matches_not_security_clearance'
        rows.append({'device': device, 'version': version, 'query_state': state,
                     'advisory_ids': ';'.join(ids), 'applicability': 'not_reviewed'})
    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=['device','version','query_state','advisory_ids','applicability'])
    writer.writeheader()
    # CSV values derive from trusted inventory/API fixtures, not arbitrary uploads.
    def safe_cell(value):
        text = '' if value is None else str(value)
        return "'"+text if text.startswith(('=','+','-','@','\t','\r','\n')) else text
    writer.writerows({k:safe_cell(v) for k,v in row.items()} for row in rows)
    return rows, output.getvalue()

inventory = [{'device': 'lab-r1', 'version': 'SYNTHETIC-RELEASE'},
             {'device': 'lab-r2', 'version': None}]
saved = {'lab-r1': {'queried_version': 'SYNTHETIC-RELEASE',
                    'advisories': [{'advisoryId': 'SYNTHETIC-ADVISORY'}]}}
rows, csv_text = advisory_rows(inventory, saved)
print(csv_text)  # Synthetic input; not a Cisco query or security finding
```

## What physical upgrade checks remain outside advisory matching?

A candidate software release must also fit platform support, boot/storage requirements, licensing and rollback constraints. Validate physical redundancy, optics and console recovery with the platform owner. A virtual inventory exercise cannot certify a switch stack's upgrade path.



## When does a patch-readiness dashboard help?

Keep source advisory IDs separate from an engineer's applicability decision. Store the decision owner, rationale and review date. A dashboard can filter stale or unresolved records and link to authoritative advisories without inventing a single fleet-wide "safe" score.



## What must be validated before offering a reporting integration?

Acceptance includes exact version joins, retained query provenance, missing-response handling and sample manual advisory reviews. Any future live adapter must add tested OAuth handling, pagination, throttling and supported endpoint/schema validation. Those API and device tests remain pending.





## Related troubleshooting and implementation

Explore the [network automation troubleshooting collection]({{ '/blog/network-automation-troubleshooting/' | relative_url }}) to connect this issue to adjacent workflows. The [Netmiko, NETCONF and RESTCONF comparison]({{ '/blog/netmiko-netconf-restconf-python-network-automation/' | relative_url }}) helps when you are choosing an interface rather than fixing an existing implementation.

## Technical references

- [Cisco PSIRT openVuln API](https://github.com/CiscoPSIRT/openVulnAPI)
- [Cisco openVulnQuery client](https://github.com/CiscoPSIRT/openVulnQuery)
- [Cisco Software Checker](https://sec.cloudapps.cisco.com/security/center/softwarechecker.x)
- [Cisco PSIRT API and endpoint lifecycle](https://developer.cisco.com/docs/psirt/iosxe/)
