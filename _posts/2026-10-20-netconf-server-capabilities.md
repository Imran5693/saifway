---
layout: "post"
title: "NETCONF Unsupported Capability: Does Your Device Support startup?"
seo_title: "NETCONF Unsupported Capability: Does Your Device Support startup?"
description: "Check NETCONF startup, candidate and writable-running capabilities with ncclient and explicit URI matching before choosing a datastore workflow."
date: "2026-10-20T10:44:27+04:00"
editorial_date: "2025-11-08"
created_date: "2026-10-19"
modified_date: "2026-10-20T10:44:27+04:00"
permalink: "/blog/netconf-server-capabilities/"
author: "Imran Sarwar"
expertise: "automation"
thumbnail: "/assets/images/blog/netconf-server-capabilities.webp"
image: "/assets/images/blog/netconf-server-capabilities.webp"
thumbnail_width: 1536
thumbnail_height: 1024
image_alt: "A conceptual router capability inventory — conceptual illustration"
article_type: "Practical guide and proposed lab"
topic_label: "Model-driven APIs"
review_collection: "automation-2026"
review_draft: false
published: true
sitemap: true
robots: "index, follow"
tags: ["ncclient unsupported capability startup", "NETCONF server_capabilities", "NETCONF candidate vs running"]
search_terms: ["ncclient unsupported capability startup", "NETCONF server_capabilities", "NETCONF candidate vs running"]
takeaways: ["NETCONF support does not imply every optional capability.", "Separate configuration storage from operational service health.", "Capability discovery should precede write-workflow design."]
related_posts: ["ncclient-unknown-element", "ncclient-get-config-timeout", "napalm-state-compliance-report", "netmiko-readtimeout-troubleshooting", "netmiko-netconf-restconf-python-network-automation"]
service_url: "/network-automation-services/#request-engineering-support"
cta_title: "Need a capability-aware NETCONF client?"
cta_text: "Share the server capability list, platform release and intended workflow. I can assess discovery, read-only retrieval and Python integration before any change automation is scoped."
---

A script requests the startup datastore and receives an unsupported-capability error. The right response is to inspect what the server actually advertises. A workflow designed for one network operating system may rely on optional behavior that another device does not provide.

**Lab status:** This is a proposed exercise, not a completed device test or client case study. Code examples require validation against your image and dependency versions. My documented background is NOC/data center operations, multi-vendor Netmiko workflows and Python/Flask integration.

**Offline example checks:** October 20, 2026: the added helper/demo block executed with local fixtures, and related negative cases were checked offline. No live device, controller, fabric or service behavior was validated.

## How does a NETCONF server advertise capabilities?

Capabilities describe protocol features and models available in a session. Optional features include particular datastores and operations. The existence of a NETCONF listener does not mean every example from the internet is applicable. Record the advertised identifiers with the device version as part of your inventory.

Capabilities are server-advertised protocol features. Optional datastore capabilities use exact URIs; a substring search for `startup` can accidentally match unrelated text. Strip query parameters only when comparing the capability identifier, and keep the original list in restricted evidence.



## How do running, candidate and startup datastores differ?

Running represents active configuration; candidate is an optional staging datastore; startup is optional persistent startup configuration. Reading running does not imply writable-running or startup support. Candidate support does not mean a commit succeeded, and this read-only guide performs no commit.





{% include blog-diagram.html src="/assets/images/diagrams/netconf-server-capabilities.svg" alt="Discover capabilities before choosing a workflow" caption="Conceptual diagnostic sequence; no measured outcomes or real device screenshots are shown." %}

## Proposed lab: inspect the advertised datastore capabilities

Start with the normal known-host-verified ncclient connection below on TCP 830, if supported. Compare actual advertised capabilities with two synthetic URI lists. Keep an unsupported optional feature visible rather than forcing the script to use another datastore silently.



## Python: check startup support without writing configuration

The helper produces independent support flags. It intentionally does not describe `running` as unreadable when `:writable-running` is absent: that capability concerns writing. Use these flags to choose an explicitly approved workflow rather than to attempt arbitrary fallback operations.

```python
import os
from getpass import getpass
from ncclient import manager

with manager.connect(
    host=os.environ['LAB_HOST'], port=830,
    username=os.environ['LAB_USER'], password=getpass('NETCONF password: '),
    hostkey_verify=True, allow_agent=False, look_for_keys=False,
    timeout=20,
) as session:
    capabilities = {str(item).split('?')[0]
                    for item in session.server_capabilities}
    startup = 'urn:ietf:params:netconf:capability:startup:1.0'
    print({'startup_advertised': startup in capabilities})
```


### Worked Python example and input contract

```python


def datastore_support(capabilities):
    # Optional capability identifiers are exact URIs; strip only query parameters.
    names = {str(c).split('?', 1)[0] for c in capabilities}
    prefix = 'urn:ietf:params:netconf:capability:'
    return {'startup': prefix+'startup:1.0' in names,
            'candidate': prefix+'candidate:1.0' in names,
            'writable_running': prefix+'writable-running:1.0' in names}

sample = ['urn:ietf:params:netconf:base:1.0',
          'urn:ietf:params:netconf:capability:candidate:1.0']
print(datastore_support(sample))  # Synthetic hello capability list
```

## How should datastore support shape the client workflow?

If startup is absent, report `unsupported_startup` and ask which persistent-source workflow the platform owner supports. Do not replace `get_config(source='startup')` with a write or assume retrieving running proves persistence across reload.



## Dashboard reporting: distinguish unsupported from failed

Show device identity, collection time, advertised capability and selected operation. Unsupported, unavailable and failed are separate states. A stale previously collected value must retain its age after a capability query fails.



## What should a capability-aware handover include?

Retain one exact capability fixture per supported image and negative cases where optional features are absent. Verify the actual read-only RPC on the image before promising datastore coverage to a client.





## Related troubleshooting and implementation

Explore the [network automation troubleshooting collection]({{ '/blog/network-automation-troubleshooting/' | relative_url }}) to connect this issue to adjacent workflows. The [Netmiko, NETCONF and RESTCONF comparison]({{ '/blog/netmiko-netconf-restconf-python-network-automation/' | relative_url }}) helps when you are choosing an interface rather than fixing an existing implementation.

## Technical references

- [NETCONF specification](https://www.rfc-editor.org/rfc/rfc6241)
- [ncclient manager API](https://ncclient.readthedocs.io/en/latest/manager.html)
