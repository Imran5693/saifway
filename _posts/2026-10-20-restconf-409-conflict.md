---
layout: "post"
title: "RESTCONF 409 Conflict: Why Does a Repeat Create Request Fail?"
seo_title: "RESTCONF 409 Conflict: Why Does a Repeat Create Request Fail?"
description: "Understand RESTCONF 409 conflicts using error tags, repeat-create fixtures and readback decisions before choosing POST, PATCH or another change."
date: "2026-10-20T10:44:27+04:00"
editorial_date: "2025-10-08"
created_date: "2026-10-19"
modified_date: "2026-10-20T10:44:27+04:00"
permalink: "/blog/restconf-409-conflict/"
author: "Imran Sarwar"
expertise: "automation"
thumbnail: "/assets/images/blog/restconf-409-conflict.webp"
image: "/assets/images/blog/restconf-409-conflict.webp"
thumbnail_width: 1672
thumbnail_height: 941
image_alt: "Two configuration resources colliding at an API target — conceptual illustration"
article_type: "Practical guide and proposed lab"
topic_label: "Model-driven APIs"
review_collection: "automation-2026"
review_draft: false
published: true
sitemap: true
robots: "index, follow"
tags: ["restconf 409 conflict", "RESTCONF data-exists", "RESTCONF POST vs PATCH"]
search_terms: ["restconf 409 conflict", "RESTCONF data-exists", "RESTCONF POST vs PATCH"]
takeaways: ["HTTP 409 can represent more than one conflict condition.", "Do not blindly retry a write whose result is uncertain.", "Read-back verification is required even after a successful response."]
related_posts: ["restconf-404-resource-path", "python-network-config-drift", "catalyst-center-api-task-polling", "netmiko-readtimeout-troubleshooting", "netmiko-netconf-restconf-python-network-automation"]
service_url: "/network-automation-services/#request-engineering-support"
cta_title: "Need help making an API workflow repeatable?"
cta_text: "Share the sanitized method, resource, error payload and intended state. I can assess conflict handling, request validation or a small change-review interface."
---

A RESTCONF script creates a resource successfully once, then fails when run again. The second request may conflict with something that already exists. The useful question is whether the existing resource matches the intended state, not whether the script can force another success status.

**Lab status:** This is a proposed exercise, not a completed device test or client case study. Code examples require validation against your image and dependency versions. My documented background is NOC/data center operations, multi-vendor Netmiko workflows and Python/Flask integration.

**Offline example checks:** October 20, 2026: the added helper/demo block executed with local fixtures, and related negative cases were checked offline. No live device, controller, fabric or service behavior was validated.

## What does RESTCONF 409 Conflict mean for a create request?

Inspect the RESTCONF error information alongside the HTTP code. A `data-exists` error suggests a creation conflict, but other conditions can also produce 409. A status-only exception removes important context. Record the method and target without exposing credentials or sensitive configuration.

A create request may fail because the target already exists, but another conflict can have a different `error-tag`. Preserve the HTTP method, target and a redacted RFC 8040 error body. The sample below is synthetic: it demonstrates classification without sending a create request.



## Why does changing POST to PATCH require more investigation?

POST creates below a parent resource; PATCH and PUT have different target and replacement/merge semantics. A guessed method change can modify more than intended. Read the existing resource, compare its identity and desired fields, and ask the resource owner to approve the specific reconciliation operation.





{% include blog-diagram.html src="/assets/images/diagrams/restconf-409-conflict.svg" alt="Resolve a conflict by inspecting state first" caption="Conceptual diagnostic sequence; no measured outcomes or real device screenshots are shown." %}

## Proposed GNS3/EVE-NG lab: examine a repeated create request

In the disposable lab, document parent path, list key and initial state. Plan first create, repeated create, readback and approved cleanup. Do not run these writes against a shared device to generate an error for an article. Offline fixtures can exercise error classification before any lab mutation.



## Python: classify a synthetic data-exists error response

The stronger classifier retains every error tag and returns `unknown_error_schema` for missing/malformed bodies. `data-exists` selects a read/compare branch, not automatic deletion. Another tag remains a review decision; no generic retry converts an unknown conflict into success.

```python
fixture = {
    'ietf-restconf:errors': {
        'error': [{'error-tag': 'data-exists',
                   'error-path': '/example:resource/item=lab'}]
    }
}
errors = fixture.get('ietf-restconf:errors', {}).get('error', [])
for error in errors:
    tag = error.get('error-tag', 'unknown')
    action = 'read_current_state' if tag == 'data-exists' else 'review_error'
    print({'tag': tag, 'next_step': action})
```


### Worked Python example and input contract

```python


def conflict_tags(payload):
    errors = payload.get('ietf-restconf:errors', {}).get('error')
    if not isinstance(errors, list) or not errors:
        return {'state': 'unknown_error_schema', 'tags': []}
    tags = [item.get('error-tag') for item in errors if isinstance(item, dict)]
    if len(tags) != len(errors) or any(not isinstance(t, str) for t in tags):
        return {'state': 'unknown_error_schema', 'tags': []}
    return {'state': 'read_existing_resource' if 'data-exists' in tags else 'review_conflict',
            'tags': tags}

sample = {'ietf-restconf:errors': {'error': [{'error-tag': 'data-exists'}]}}
print(conflict_tags(sample))  # Synthetic error; no write is issued
```

## How should a repeatable workflow compare existing state?

Define three outcomes: existing state matches, existing state differs, and state could not be read. Only the first may satisfy the defined request without another write. The second needs a scoped change; the third remains unresolved. Keep the original request's correlation ID.



## What evidence should confirm the intended resource state?

Read the same resource after the approved operation and evaluate its intended fields. HTTP success alone does not verify every dependent interface, route or service. A failed readback is unknown rather than proof that the write failed safely.



## When would a reconciliation dashboard help?

A dashboard can present the diff, decision owner and operation history while keeping mutation behind a separate authorized workflow. Scope the work to a reviewed resource adapter, not an unrestricted RESTCONF request builder exposed through a web form.





## Related troubleshooting and implementation

Explore the [network automation troubleshooting collection]({{ '/blog/network-automation-troubleshooting/' | relative_url }}) to connect this issue to adjacent workflows. The [Netmiko, NETCONF and RESTCONF comparison]({{ '/blog/netmiko-netconf-restconf-python-network-automation/' | relative_url }}) helps when you are choosing an interface rather than fixing an existing implementation.

## Technical references

- [RESTCONF protocol specification](https://www.rfc-editor.org/rfc/rfc8040)
- [Cisco RESTCONF conflict examples](https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/prog/configuration/166/b_166_programmability_cg/restconf_prog_int.html)
