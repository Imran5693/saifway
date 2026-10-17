---
layout: post
title: "Netmiko vs NETCONF vs RESTCONF: Choosing a Python Network Automation Interface"
description: "Compare SSH automation with Netmiko, NETCONF and RESTCONF. Imran Sarwar explains device support, structured data, validation and production change considerations."
date: 2026-10-17 09:00:00 +0400
permalink: /blog/netmiko-netconf-restconf-python-network-automation/
tags: [Python, Network Automation, Netmiko, NETCONF, RESTCONF, Network APIs]
expertise: automation
thumbnail: /assets/images/blog/python-netmiko-automation.png
---

**By Imran Sarwar — network infrastructure and Python automation.** This is a technical comparison, not a claim that all three interfaces have been deployed in my projects. My implementation case study uses Python and Netmiko; NETCONF and RESTCONF are described here using their protocol specifications.

## Which interface should you choose?

<figure class="my-4">
  <img src="{{ '/assets/images/diagrams/network-automation-interfaces.svg' | relative_url }}" alt="Comparison of Netmiko CLI sessions, NETCONF XML RPCs, RESTCONF YANG resources and vendor REST APIs" width="1100" height="960" class="img-fluid rounded-4" loading="lazy">
  <figcaption class="small text-muted mt-2">Four alternative interfaces to assess against device support and the required workflow.</figcaption>
</figure>

Start with what the device supports and the result you need. **Netmiko** is useful for automating existing CLI workflows over SSH. **NETCONF** provides structured RPC operations for configuration and state, with capabilities that vary by server. **RESTCONF** provides an HTTP interface to YANG-defined data using XML or JSON. A vendor REST API may expose a different model and is not automatically RESTCONF.

<div class="table-responsive interface-comparison" markdown="1">

| Interface | How you interact | Useful starting point | Check before choosing |
| --- | --- | --- | --- |
| Netmiko | Python library driving device CLI sessions, usually over SSH | Existing show commands and vendor-specific operational tasks | Device type, privilege, prompts, timing and output format |
| NETCONF | Structured XML RPCs, commonly over SSH | Model-driven configuration and state retrieval | Advertised capabilities, supported YANG models and datastores |
| RESTCONF | HTTP methods over HTTPS against YANG data resources | HTTP-based applications using supported network data models | Resource paths, authentication, model support and error behavior |
| Vendor REST API | Vendor-specific HTTP resources | Controller or platform workflows exposed by that product | API version, permissions, rate limits and vendor documentation |
{: .table .table-bordered style="min-width: 760px;"}

</div>

No interface makes an untested network change safe by itself. Validate both the configuration result and the operational behavior your users depend on.

## Where Netmiko fits in a traditional network

CLI-based automation can be a practical bridge for a mixed device estate. The device may already support the show commands and administrative workflow your team uses. Python can handle inventory, connect to each device and produce a per-device result.

In my [multi-vendor automation project]({{ '/projects/2025-06-27-multi-vendor-user-creation/' | relative_url }}), the engineering work includes platform classification, prompt handling and vendor-specific execution behavior. That is why a script that works against one lab switch should not be assumed to work unchanged across every platform.

Use the [Netmiko walkthrough]({{ '/2025/05/18/python-network-automation-with-netmiko.html' | relative_url }}) for the related user management workflow. See the [official Netmiko documentation](https://ktbyers.github.io/netmiko/) for supported features and usage.

## What NETCONF adds

NETCONF defines structured operations for retrieving and changing configuration. A server advertises its capabilities during session establishment. Features such as candidate configuration, validation and confirmed commit depend on the capabilities implemented by that server; do not assume that every device provides them.

Before designing a Python NETCONF workflow, identify the supported models, select the intended datastore and test how the platform returns errors. The authoritative protocol description is [RFC 6241](https://www.rfc-editor.org/rfc/rfc6241).

## What RESTCONF adds

RESTCONF exposes YANG-defined resources through HTTP methods. It can fit naturally into an application that already uses HTTP clients, but the workflow still depends on the platform's actual data models, authorization and implementation.

An HTTP success response should be followed by checks of the intended state. Read the device documentation for supported operations and concurrency behavior. RESTCONF does not reproduce every NETCONF operation or capability. See [RFC 8040](https://www.rfc-editor.org/rfc/rfc8040).

## A validation checklist before production use

1. Record the device model, software version, interface and supported capabilities.
2. Start with read-only retrieval against an authorized lab or staging device.
3. Keep credentials outside source code and validate the server's identity.
4. Define the expected result, failure handling and recovery procedure.
5. Apply an approved change to a small scope before wider execution.
6. Compare the resulting state with your acceptance checks and retain sanitized logs.

For SSH workflows, include prompt detection and timing failures in the test plan. For HTTP APIs, include authentication failures, unexpected data and partial application behavior. Retry logic needs to account for whether an operation can safely be repeated.

## From a script to an operational application

A Flask application can provide an interface for inventory selection, approval inputs and result review. Device credentials, permissions, execution and audit records still need a deliberate design. My [OpenStack identity management application]({{ '/projects/2025-04-24-idmui-openstack/' | relative_url }}) shows a related Python/Flask and REST API application pattern; it is a separate project from network device NETCONF or RESTCONF delivery.

For an existing script or infrastructure workflow, [discuss network automation and production project support]({{ '/network-automation-services/' | relative_url }}). Include the platforms, current error and expected result so the work can be scoped around evidence.
