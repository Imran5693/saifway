---
layout: "post"
title: "NAPALM Compliance Reports: Can You Trust a Pass with Skipped Checks?"
seo_title: "NAPALM Compliance Reports: Can You Trust a Pass with Skipped Checks?"
description: "Review NAPALM compliance reports with a validator example and Python checks for missing, failed and skipped getters before showing a pass."
date: "2026-10-20T10:44:27+04:00"
editorial_date: "2026-09-08"
created_date: "2026-10-19"
modified_date: "2026-10-20T10:44:27+04:00"
permalink: "/blog/napalm-state-compliance-report/"
author: "Imran Sarwar"
expertise: "automation"
thumbnail: "/assets/images/blog/napalm-state-compliance-report.webp"
image: "/assets/images/blog/napalm-state-compliance-report.webp"
thumbnail_width: 1536
thumbnail_height: 1024
image_alt: "Expected and observed network state with an unknown marker — conceptual illustration"
article_type: "Practical guide and proposed lab"
topic_label: "Infrastructure diagnostics"
review_collection: "automation-2026"
review_draft: false
published: true
sitemap: true
robots: "index, follow"
tags: ["napalm compliance report", "napalm validate network state", "python network compliance checks"]
search_terms: ["napalm compliance report", "napalm validate network state", "python network compliance checks"]
takeaways: ["NAPALM validation evaluates operational state through getters.", "Skipped checks must remain visible even when overall compliance is true.", "A compliance report is only as broad as its assertions and coverage."]
related_posts: ["pyats-pre-post-change-checks", "nornir-retry-failed-hosts", "python-network-config-drift", "netmiko-readtimeout-troubleshooting", "netmiko-netconf-restconf-python-network-automation"]
service_url: "/network-automation-services/#request-engineering-support"
cta_title: "Need a trustworthy network validation dashboard?"
cta_text: "I can scope expected-state checks and reporting that keeps unsupported or missing evidence visible. Share the device/driver matrix and the operational rules you need to verify."
---

A NAPALM report says the device complies, but one requested getter was skipped. Is the device ready for a change? You need both the result and the coverage: an overall boolean cannot show whether every required assertion was evaluated.

**Lab status:** This is a proposed exercise, not a completed device test or client case study. Code examples require validation against your image and dependency versions. My documented background is NOC/data center operations, multi-vendor Netmiko workflows and Python/Flask integration.

**Offline example checks:** October 20, 2026: the added helper/demo block executed with local fixtures, and related negative cases were checked offline. No live device, controller, fabric or service behavior was validated.

## What network state does NAPALM validation check?

NAPALM's validation workflow compares getter output with expected values. It is a way to express operational expectations, such as selected facts or interface state. It is not automatically a full security audit or a complete configuration review. Driver and platform support determine which data can be collected.

NAPALM validators evaluate returned state from named getters. They do not certify an external compliance framework or all configured features. A top-level pass applies only to evaluated assertions, so the required-check set must exist outside the report.



## Why can skipped checks undermine an overall compliance pass?

Inspect top-level `skipped`, per-getter results and missing expected keys. A report claiming `complies: true` with a missing mandatory getter is incomplete. Report a failed evaluated check as well, even when other evidence is missing; incomplete coverage must not conceal the failures already found.





{% include blog-diagram.html src="/assets/images/diagrams/napalm-state-compliance-report.svg" alt="Keep unsupported checks visible" caption="Conceptual diagnostic sequence; no measured outcomes or real device screenshots are shown." %}

## Proposed GNS3/EVE-NG lab: define required validation coverage

Start with one supported getter and an authorized device connection. This minimal validator, saved as `validate.yml`, checks one explicitly expected hostname; replace it with the real lab expectation.

```yaml
- get_facts:
    hostname: LAB-R1
```

With an already initialized, host-identity-verified driver connection named `device`, collect `report = device.compliance_report('validate.yml')`. Driver access/TLS/SSH settings vary by platform and must be reviewed separately. Save the returned JSON in a restricted location; no live driver call is made by the offline summarizer.



## Python: summarize a saved compliance report conservatively

The stronger summarizer below uses an explicit required-getter set. It rejects malformed boolean results and lists missing, skipped and failed checks independently. Its `pass_required_checks` state is deliberately narrower than the report's top-level flag. A synthetic fixture demonstrates the otherwise misleading pass-with-skipped case.

```python
import json
from pathlib import Path

report = json.loads(Path("compliance-report.json").read_text(encoding="utf-8"))
skipped = report.get("skipped", [])
if report.get("complies") is False:
    status = "failed"
elif report.get("complies") is not True:
    status = "unknown"
elif skipped:
    status = "incomplete"
else:
    status = "passed-defined-checks"
print({"status": status, "skipped": skipped})
```


### Worked Python example and input contract

```python


def compliance_summary(report, required):
    if not required or not isinstance(report, dict):
        raise ValueError('report_and_required_checks_needed')
    skipped = report.get('skipped', [])
    if not isinstance(skipped, list):
        return {'state': 'unknown_report_schema'}
    missing = sorted(k for k in required if k not in report)
    not_evaluated = sorted(k for k in required if k in skipped or
                           isinstance(report.get(k),dict) and report[k].get('skipped') is True)
    malformed = sorted(k for k in required if k in report and
                        (not isinstance(report[k],dict) or type(report[k].get('complies')) is not bool))
    failed = sorted(k for k in required if isinstance(report.get(k),dict) and report[k].get('complies') is False)
    state = 'incomplete' if missing or not_evaluated or malformed else 'fail' if failed else 'pass_required_checks'
    return {'state': state, 'missing': missing, 'skipped': not_evaluated,
            'malformed': malformed, 'failed': failed}

sample = {'complies': True, 'skipped': ['get_environment'],
          'get_facts': {'complies': True}}
print(compliance_summary(sample, {'get_facts','get_environment'}))
# Synthetic report: missing mandatory coverage cannot pass.
```

## How should required network-state assertions be defined?

An interface assertion should name the required interface and operational condition, not just a count. Strict mode is scoped to the YAML level where it appears, so use it only where extra objects truly represent a failure. Inspect actual getter output before defining a validator, and keep the required-set version with the job.



## What can a compliance dashboard claim from the available evidence?

Include required/evaluated counts, per-check outcomes, snapshot time and evidence age. A previously passing report becomes stale when a new job fails. Do not reuse the previous green tile as the latest outcome, and keep security/regulatory certification outside this state-validation scope.





## Related troubleshooting and implementation

Explore the [network automation troubleshooting collection]({{ '/blog/network-automation-troubleshooting/' | relative_url }}) to connect this issue to adjacent workflows. The [Netmiko, NETCONF and RESTCONF comparison]({{ '/blog/netmiko-netconf-restconf-python-network-automation/' | relative_url }}) helps when you are choosing an interface rather than fixing an existing implementation.

## Technical references

- [NAPALM validation documentation](https://napalm.readthedocs.io/en/latest/validate/index.html)
- [NAPALM supported platforms](https://napalm.readthedocs.io/en/latest/support/index.html)
