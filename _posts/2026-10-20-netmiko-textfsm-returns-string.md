---
layout: "post"
title: "Netmiko TextFSM Returns a String: Why Is Parsing Failing?"
seo_title: "Netmiko TextFSM Returns a String: Why Is Parsing Failing?"
description: "Diagnose Netmiko TextFSM raw-string results with template lookup checks, an explicit parsing example and offline fixtures before testing your device image."
date: "2026-10-20T10:44:27+04:00"
editorial_date: "2025-05-17"
created_date: "2026-10-19"
modified_date: "2026-10-20T10:44:27+04:00"
permalink: "/blog/netmiko-textfsm-returns-string/"
author: "Imran Sarwar"
expertise: "automation"
thumbnail: "/assets/images/blog/netmiko-textfsm-returns-string.webp"
image: "/assets/images/blog/netmiko-textfsm-returns-string.webp"
thumbnail_width: 1727
thumbnail_height: 911
image_alt: "CLI output passing through a parser into structured records — conceptual illustration"
article_type: "Practical guide and proposed lab"
topic_label: "CLI automation"
review_collection: "automation-2026"
review_draft: false
published: true
sitemap: true
robots: "index, follow"
tags: ["netmiko textfsm returns string", "use_textfsm not working", "Netmiko parsing troubleshooting"]
search_terms: ["netmiko textfsm returns string", "use_textfsm not working", "Netmiko parsing troubleshooting"]
takeaways: ["A completed SSH command does not prove parsing succeeded.", "Retain raw output so template failures can be reproduced offline.", "Treat unexpected output types as a reportable failure."]
related_posts: ["pyats-pre-post-change-checks", "napalm-state-compliance-report", "python-network-config-drift", "netmiko-readtimeout-troubleshooting", "netmiko-netconf-restconf-python-network-automation"]
service_url: "/network-automation-services/#request-engineering-support"
cta_title: "Need help turning CLI output into a reliable report?"
cta_text: "Share a sanitized command response, device/software version and the fields your report needs. I can assess parser debugging, Netmiko integration or a scoped Flask dashboard."
---

Your Netmiko command returns useful text, but the next line of Python fails because it expected a list of dictionaries. The device may be reachable and the command may be correct; the broken step can be the conversion from CLI text into structured records. This guide focuses on diagnosing that boundary before building an inventory or dashboard on top of it.

**Lab status:** This is a proposed exercise, not a completed device test or client case study. Code examples require validation against your image and dependency versions. My documented background is NOC/data center operations, multi-vendor Netmiko workflows and Python/Flask integration.

**Offline example checks:** October 20, 2026: the added helper/demo block executed with local fixtures, and related negative cases were checked offline. No live device, controller, fabric or service behavior was validated.

## How does use_textfsm change Netmiko command output?

TextFSM describes how to extract fields from a text response. Netmiko can pass command output to a matching template, but a parser is dependent on the platform name, command and exact output format. A firmware change, different command variant or missing template can invalidate those assumptions. The library's return type must be checked before treating it as structured data.

Keep three artifacts separate: the raw command capture, the selected template and the parsed records. Netmiko 4.7.0 can raise a parsing exception with `raise_parsing_error=True`; a list still needs schema and coverage checks. Record all parser/template versions in the same virtual environment used by the scheduler.



## Why does TextFSM parsing fail when the CLI command works?

Check the installed `ntc_templates` package first. If `NET_TEXTFSM` is set, resolve it to the actual templates directory containing `index`; do not point it at a repository root or rely on an unexpanded `~`. Use the full command spelling in the index. An explicit `textfsm_template` separates template discovery from template correctness: if it works while automatic selection fails, investigate the index mapping.

| Observation | Investigate next |
| --- | --- |
| Manual command returns an authorization error | Fix command permissions before parsing |
| Python returns raw text | Check template discovery and command/platform matching |
| Parser returns no records | Compare the template against the complete captured input |
| Only some interfaces appear | Check optional fields, wrapped lines and output variants |




{% include blog-diagram.html src="/assets/images/diagrams/netmiko-textfsm-returns-string.svg" alt="From raw CLI output to validated records" caption="Conceptual diagnostic sequence; no measured outcomes or real device screenshots are shown." %}

## Proposed GNS3/EVE-NG lab: investigate raw-string fallback

For a minimal offline exercise, save the following intentionally narrow template as `interfaces.textfsm`. It accepts only the synthetic two-column input below, not real IOS output. Replace it with a reviewed platform template for your captured device response.

```text
Value Required INTERFACE (\S+)
Value STATE (up|down)

Start
  ^${INTERFACE}\s+${STATE}$$ -> Record
```

The doubled dollar signs in the rule are TextFSM's literal end-of-line anchor syntax. Use a fixture with both up and down interfaces, then a truncated or wrong-format fixture. A parser change that drops down interfaces would hide operational evidence.



## Python: reject unexpected parser output before using it

The additional offline function below validates collection markers and duplicate names, then parses an explicitly supplied template. The live equivalent is `conn.send_command('show ip interface brief', use_textfsm=True, textfsm_template='/approved/template.textfsm', raise_parsing_error=True, read_timeout=30)`. That call assumes an authenticated, host-key-verified Netmiko 4.7.0 connection; it has not been device-tested here.

```python
def collect_interfaces(conn):
    command = 'show ip interface brief'
    rows = conn.send_command(command, use_textfsm=True, read_timeout=30)
    if not isinstance(rows, list):
        raise ValueError('Expected parsed records; inspect raw output and template')
    if not rows or any(not isinstance(row, dict) for row in rows):
        raise ValueError('Empty or unexpected parsed record structure')
    return rows
```


### Worked Python example and input contract

```python
import re
from pathlib import Path

def parse_interfaces(raw, template_path):
    import textfsm
    if not raw.strip() or '--More--' in raw or re.search(r'(?m)^\s*%', raw):
        raise ValueError('collection_not_accepted')
    with Path(template_path).open(encoding='utf-8') as stream:
        parser = textfsm.TextFSM(stream)
        values = parser.ParseText(raw)
        records = [dict(zip(parser.header, row)) for row in values]
    if not records or any(not row.get('INTERFACE') for row in records):
        raise ValueError('missing_interface_records')
    names = [row['INTERFACE'] for row in records]
    if len(set(names)) != len(names):
        raise ValueError('duplicate_interface_record')
    return records

# Offline input; use the narrow interfaces.textfsm template shown above.
print(parse_interfaces('Ethernet1 up\nEthernet2 down\n', 'interfaces.textfsm'))
```

## When is a structured API a better fit than CLI parsing?

Choose an API only after checking that its operational model covers the required fields and interfaces. Keep a schema adapter in either design. For example, a missing interface record must remain `unknown` until you distinguish unsupported data, collection loss and a real inventory change.



## Parser handover: templates, supported commands and failure states

A useful handover contains a command/template matrix, one sanitized fixture per supported output variant and a named owner for template changes. Dashboard fields should include collection status, parse status, expected interface coverage and observation time; never turn a parser exception into an empty healthy inventory.



## How should you validate the parsing result?

Acceptance means the expected interface set and required fields match the reviewed fixture, including down interfaces. Run that test before testing against the actual image. Offline parsing cannot prove the live command is complete, paging is disabled or the account sees every interface.





## Related troubleshooting and implementation

Explore the [network automation troubleshooting collection]({{ '/blog/network-automation-troubleshooting/' | relative_url }}) to connect this issue to adjacent workflows. The [Netmiko, NETCONF and RESTCONF comparison]({{ '/blog/netmiko-netconf-restconf-python-network-automation/' | relative_url }}) helps when you are choosing an interface rather than fixing an existing implementation.

## Technical references

- [Netmiko API reference](https://ktbyers.github.io/netmiko/docs/netmiko/base_connection.html)
- [Netmiko parsing issue with an explicit template](https://github.com/ktbyers/netmiko/issues/3651)
- [NTC Templates project](https://github.com/networktocode/ntc-templates)
- [Netmiko parsing implementation](https://ktbyers.github.io/netmiko/docs/netmiko/utilities.html)
