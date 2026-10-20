---
layout: "post"
title: "SD-Access Endpoint Unreachable: Is It Attachment, LISP or Policy?"
seo_title: "SD-Access Endpoint Unreachable: Is It Attachment, LISP or Policy?"
description: "Trace an unreachable SD-Access endpoint through attachment, LISP, policy and return-path evidence. Python examples use synthetic records, not a live fabric."
date: "2026-10-20T10:44:27+04:00"
editorial_date: "2026-07-08"
created_date: "2026-10-19"
modified_date: "2026-10-20T10:44:27+04:00"
permalink: "/blog/sdaccess-endpoint-unreachable/"
author: "Imran Sarwar"
expertise: "automation"
thumbnail: "/assets/images/blog/sdaccess-endpoint-unreachable.webp"
image: "/assets/images/blog/sdaccess-endpoint-unreachable.webp"
thumbnail_width: 1536
thumbnail_height: 1024
image_alt: "An endpoint path through fabric components — conceptual illustration"
article_type: "Practical guide and proposed lab"
topic_label: "Controller and fabric"
review_collection: "automation-2026"
review_draft: false
published: true
sitemap: true
robots: "index, follow"
tags: ["sd access endpoint unreachable", "cisco sda endpoint troubleshooting", "sd access lisp endpoint registration"]
search_terms: ["sd access endpoint unreachable", "cisco sda endpoint troubleshooting", "sd access lisp endpoint registration"]
takeaways: ["Start with endpoint attachment before investigating the overlay.", "Keep endpoint, VRF and mapping identities together.", "A gateway ping alone is not a complete fabric test."]
related_posts: ["sdaccess-access-tunnel-missing", "sdwan-bfd-down-control-up", "napalm-state-compliance-report", "netmiko-readtimeout-troubleshooting", "netmiko-netconf-restconf-python-network-automation"]
service_url: "/network-automation-services/#request-engineering-support"
cta_title: "Need an endpoint investigation checklist or evidence tool?"
cta_text: "I can scope a read-only evidence workflow and dashboard using your platform's supported outputs. Live SDA diagnosis and policy changes require your fabric specialist and a supported environment."
---

An SD-Access endpoint has an IP address but cannot reach its application. The failure could begin at the access port, endpoint registration, fabric forwarding, policy or return path. A structured trace avoids treating every symptom as a controller problem.

**Lab status:** This is a proposed exercise, not a completed device test or client case study. Code examples require validation against your image and dependency versions. Controller/fabric platform access is not confirmed; offline samples demonstrate report logic only. My documented background is NOC/data center operations, multi-vendor Netmiko workflows and Python/Flask integration.

**Offline example checks:** October 20, 2026: the added helper/demo block executed with local fixtures, and related negative cases were checked offline. No live device, controller, fabric or service behavior was validated.

## Which endpoint, fabric and policy details identify the incident?

Record the source MAC and IP, destination IP and service port, virtual network or VRF, attachment point and failure time. Preserve the distinction between wired and wireless access. Without these identifiers, output from different endpoint instances can be combined incorrectly.

Record source/destination, source MAC, fabric site, VN/VRF, source edge and observation time. Add source/destination group context where policy applies. Confusing two address spaces or two endpoints with the same IP can invalidate every later inference.



## Why start with the endpoint attachment point?

Confirm link, VLAN/VN assignment and authentication/authorization at the actual attachment point first. A correct IP address is not proof of the expected fabric context. If attachment is wrong, later LISP/policy observations may describe a different path.





{% include blog-diagram.html src="/assets/images/diagrams/sdaccess-endpoint-unreachable.svg" alt="Trace an endpoint across the fabric" caption="Conceptual diagnostic sequence; no measured outcomes or real device screenshots are shown." %}

## Proposed SD-Access lab: confirm the required fabric platform

A supported SD-Access design requires appropriate fabric/control-plane/platform access beyond the confirmed router lab. Until available, use a case worksheet and synthetic normalized booleans. Do not present a generic IOS VM or a field-validation script as a fabric reproduction.



## Python: validate a synthetic endpoint-evidence record

The new decision helper demands an observation for each stage and preserves unknown values. Its input schema is illustrative, not a Catalyst Center response. It can identify an unchecked return path or failed registration observation, but cannot prove those observations are correct.

```python
required = {"source_ip", "source_mac", "destination_ip", "vrf", "edge", "collected_at"}
record = {
    "source_ip": "192.0.2.10", "source_mac": "02:00:00:00:00:10",
    "destination_ip": "198.51.100.20", "vrf": "LAB",
    "edge": "fabric-edge-example"
}
missing = sorted(key for key in required if not record.get(key))
print({"evidence_complete": not missing, "missing_fields": missing})
```


### Worked Python example and input contract

```python


def endpoint_evidence(record):
    keys = ('attached','registered','mapping_matches','policy_allows','return_path_checked')
    if any(k not in record or record[k] is None for k in keys):
        return {'state': 'unknown_evidence'}
    if any(type(record[k]) is not bool for k in keys):
        raise ValueError('boolean_or_unknown_required')
    return {'state': 'review_required' if not all(record[k] for k in keys) else 'checks_match_requires_service_test',
            'failed_checks': [k for k in keys if not record[k]]}

sample = {'attached': True, 'registered': True, 'mapping_matches': True,
          'policy_allows': True, 'return_path_checked': None}
print(endpoint_evidence(sample))  # Synthetic case with an unchecked return path
```

## How should you trace LISP registration and forwarding?

With the fabric owner, establish that the endpoint registration identifies the expected attachment/RLOC, then compare mapping/forwarding evidence on the source and destination path. Use the release-correct LISP commands from the linked guide; command syntax and instance identifiers are platform-specific. A control-plane database entry alone does not prove service forwarding.



## How should you test policy and return-path behavior?

Compare intended policy with source/destination group context and an authorized application transaction. Isolate return routing and policy direction rather than disabling segmentation globally. Retain failed-stage evidence when a service test cannot run.



## Where can endpoint evidence collection be automated?

Scope a read-only evidence adapter and case report with source timestamps, missing fields and owners. A future live connector requires validated schemas and permissions. The offline boolean evaluator is a triage aid, not an automated diagnosis of a real fabric.





## Related troubleshooting and implementation

Explore the [network automation troubleshooting collection]({{ '/blog/network-automation-troubleshooting/' | relative_url }}) to connect this issue to adjacent workflows. The [Netmiko, NETCONF and RESTCONF comparison]({{ '/blog/netmiko-netconf-restconf-python-network-automation/' | relative_url }}) helps when you are choosing an interface rather than fixing an existing implementation.

## Technical references

- [Cisco SD-Access fabric troubleshooting guide](https://www.cisco.com/c/en/us/td/docs/cloud-systems-management/network-automation-and-management/dna-center/tech_notes/sda_fabric_troubleshooting/b_cisco_sda_fabric_troubleshooting_guide.html)
