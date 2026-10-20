---
layout: "post"
title: "SD-WAN BFD Down: Why Are Control Connections Still Up?"
seo_title: "SD-WAN BFD Down: Why Are Control Connections Still Up?"
description: "Investigate SD-WAN BFD failures using expected peer/color pairs, read-only CLI evidence and a Python matrix that preserves missing observations."
date: "2026-10-20T10:44:27+04:00"
editorial_date: "2026-06-08"
created_date: "2026-10-19"
modified_date: "2026-10-20T10:44:27+04:00"
permalink: "/blog/sdwan-bfd-down-control-up/"
author: "Imran Sarwar"
expertise: "automation"
thumbnail: "/assets/images/blog/sdwan-bfd-down-control-up.webp"
image: "/assets/images/blog/sdwan-bfd-down-control-up.webp"
thumbnail_width: 1536
thumbnail_height: 1024
image_alt: "Separate controller and branch data paths — conceptual illustration"
article_type: "Practical guide and proposed lab"
topic_label: "Controller and fabric"
review_collection: "automation-2026"
review_draft: false
published: true
sitemap: true
robots: "index, follow"
tags: ["sd wan bfd down control up", "cisco sdwan bfd troubleshooting", "sdwan data tunnel down"]
search_terms: ["sd wan bfd down control up", "cisco sdwan bfd troubleshooting", "sdwan data tunnel down"]
takeaways: ["Control connectivity does not prove peer-to-peer data connectivity.", "Correlate BFD failures by peer, color and time.", "Check the physical transport before tuning timers."]
related_posts: ["sdwan-certificate-control-errors", "sdwan-template-out-of-sync", "sdaccess-endpoint-unreachable", "netmiko-readtimeout-troubleshooting", "netmiko-netconf-restconf-python-network-automation"]
service_url: "/network-automation-services/#request-engineering-support"
cta_title: "Need a repeatable SD-WAN evidence bundle?"
cta_text: "I can scope read-only collection and a peer/tunnel status dashboard. Live fabric diagnosis and configuration correction need the responsible SD-WAN engineer and an authorized platform."
---

A branch has healthy controller connections but its BFD sessions to another site are down. These observations can coexist: reaching a controller and exchanging data between WAN edges use different paths and requirements.

**Lab status:** This is a proposed exercise, not a completed device test or client case study. Code examples require validation against your image and dependency versions. Controller/fabric platform access is not confirmed; offline samples demonstrate report logic only. My documented background is NOC/data center operations, multi-vendor Netmiko workflows and Python/Flask integration.

**Offline example checks:** October 20, 2026: the added helper/demo block executed with local fixtures, and related negative cases were checked offline. No live device, controller, fabric or service behavior was validated.

## What do BFD sessions check between WAN edges?

In Cisco SD-WAN, BFD participates in monitoring data-plane tunnel liveliness. Control connections serve a different role. An up control connection is useful evidence, but it cannot certify the transport path between every pair of edges.

BFD assesses a particular edge-to-edge data-plane session; controller reachability is another path. Do not expect every potential color/peer pair to exist: topology and policy may intentionally constrain sessions. Define the expected peer matrix from the approved design.



## Why must you identify the peer and transport color?

Key each observation by local edge, remote edge, local transport color and remote transport color. A single green aggregate can hide one failed transport. Public/private addressing, NAT and encapsulation belong to that specific pair, not a generic site label.





{% include blog-diagram.html src="/assets/images/diagrams/sdwan-bfd-down-control-up.svg" alt="Separate control and data-plane evidence" caption="Conceptual diagnostic sequence; no measured outcomes or real device screenshots are shown." %}

## Proposed SD-WAN lab: separate control and data-path evidence

Without supported SD-WAN controllers/edges, use normalized synthetic pairs for reporting tests. In a later authorized lab, establish one expected tunnel and collect both ends before introducing a controlled transport fault. Do not claim GNS3 alone supplies an SD-WAN fabric.



## Read-only CLI: collect BFD and control-connection state

For IOS XE SD-WAN, the listed `show sdwan` commands are starting points; vEdge syntax differs. Read the peer/color and BFD state, then correlate control history and the relevant interface. The added matrix function retains absent observations as unknown. It does not parse arbitrary CLI text or infer an expected topology.

```text
show sdwan control connections
show sdwan bfd sessions
show sdwan control connections-history
show interfaces
```


### Worked Python example and input contract

```python


def bfd_matrix(expected_pairs, observations):
    # Adapter-normalized tuples: local-edge, remote-edge, local-color, remote-color.
    rows = []
    for pair in expected_pairs:
        if len(pair) != 4:
            raise ValueError('four_part_peer_key_required')
        state = observations.get(tuple(pair))
        rows.append({'peer_key': tuple(pair), 'state': state if state in ('up','down') else 'unknown'})
    return rows

pairs = [('edge-a', 'edge-b', 'mpls', 'mpls'),
         ('edge-a', 'edge-b', 'biz-internet', 'biz-internet')]
observed = {pairs[0]: 'up'}
print(bfd_matrix(pairs, observed))  # Missing second observation stays unknown
```

## How should you trace the underlying transport path?

For the affected pair, check transport interface/address, route to the peer, NAT behavior, ACL/firewall permission and MTU evidence. A physical link can be up while the required encapsulated traffic is blocked. Use bounded approved tests and compare both endpoints; do not flush tunnels or disable filtering to make a dashboard green.



## Dashboard reporting: summarize affected peers and transports

Show each expected pair, current observation, last successful state and evidence age. A missing collector result is not BFD down. A design change that removes a pair requires a reviewed expectation update, not automatic deletion of a failure row.



## What evidence should confirm BFD recovery?

Recovery needs the expected BFD sessions plus representative service forwarding under the intended policy. Keep controller and transport evidence timestamps aligned. The synthetic matrix cannot establish packet forwarding, convergence or hardware path health.





## Related troubleshooting and implementation

Explore the [network automation troubleshooting collection]({{ '/blog/network-automation-troubleshooting/' | relative_url }}) to connect this issue to adjacent workflows. The [Netmiko, NETCONF and RESTCONF comparison]({{ '/blog/netmiko-netconf-restconf-python-network-automation/' | relative_url }}) helps when you are choosing an interface rather than fixing an existing implementation.

## Technical references

- [Cisco troubleshooting common BFD errors](https://www.cisco.com/c/en/us/td/docs/routers/sdwan/configuration/routing/ios-xe-17/routing-configuration-guide-17-x/bfd/troubleshoot-common-bfd-errors.html)
- [Cisco common control and data connection errors](https://www.cisco.com/c/en/us/support/docs/routers/sd-wan/222302-troubleshoot-common-sd-wan-control-and-d.html)
