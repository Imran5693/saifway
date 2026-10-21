---
layout: post
title: 'Python AD DNS SRV Health Check: Resolve Targets and Report Partial Answers'
seo_title: 'Python AD DNS SRV Check: Targets and Partial Answers'
description: Check AD SRV records and target A/AAAA dependencies with Python, preserving DNS errors and partial answers through a narrow contract and offline fixtures.
date: '2026-09-04T09:00:00+04:00'
author: Imran Sarwar
permalink: /blog/python-ad-dns-srv-health-check/
expertise: infrastructure
topic_label: Python DNS and directory diagnostics
article_type: Troubleshooting guide and hypothetical lab
thumbnail: /assets/images/blog/python-ad-dns-srv-health-check-thumbnail.webp
image: /assets/images/blog/python-ad-dns-srv-health-check-thumbnail.webp
thumbnail_width: 1200
thumbnail_height: 630
image_alt: Conceptual AD SRV discovery branching into separate target A and AAAA address checks
tags:
- Python AD DNS SRV health check
- Python DNS and directory diagnostics
search_terms:
- Python AD DNS SRV health check
- dnspython AD SRV query
- Python DNS NXDOMAIN timeout
- SRV target A AAAA check
- AD DNS partial health report
copy_commands: true
related_posts:
- active-directory-domain-controller-not-contacted-dns
- windows-time-not-synchronizing-domain
- ubuntu-dns-netplan-troubleshooting
service_url: /remote-network-infrastructure-support/
cta_title: Need help tracing an infrastructure failure?
cta_text: Share sanitized evidence, the platform version and the intended behavior. Imran Sarwar can assess a scoped infrastructure investigation.
published: true
sitemap: true
primary_keyword: Python AD DNS SRV health check
secondary_keywords:
- dnspython AD SRV query
- Python DNS NXDOMAIN timeout
- SRV target A AAAA check
- AD DNS partial health report
---

An SRV answer can advertise a domain controller whose address record is missing. A normal hostname lookup does not inspect that dependency chain. Query the intended AD discovery name, preserve each SRV target and resolve its A and AAAA records separately so partial DNS results stay visible.

**Scope and evidence:** Proposed Python 3.10+ diagnostic using dnspython 2.x and an explicitly selected authorized AD DNS server `192.0.2.53`. Domain `example.test`, targets and addresses are documentation fixtures. The query is `_ldap._tcp.dc._msdcs.example.test.`. No real directory, DNS response or working domain join is claimed. Site-specific discovery, multiple forests and application-specific address-family policy require additional checks.

<span id="define-what-the-check-can-establish"></span>

## Define the Scope of an AD SRV and Target-Address Check

This check asks whether the selected resolver returns discovery records and at least one address for each advertised target. It does not validate LDAP, Kerberos, RPC, DC Locator selection, replication or the full AD join workflow. An IPv4 address with AAAA NoAnswer can be usable in an IPv4 design; a timeout for AAAA is still an unresolved query even when A works. Keep both the usable-address observation and query completeness.

{% include blog-diagram.html src="/assets/images/diagrams/python-ad-dns-srv-health-check-topology.svg" scrollable=true alt="Selected DNS resolver returns AD discovery SRV records; each target has independent A and AAAA outcomes, with one usable target and another unresolved dependency reported separately" caption="Hypothetical dependency graph. An SRV answer alone is not a complete target-address or directory-health result." %}

The [SRV specification](https://www.rfc-editor.org/rfc/rfc2782.html) defines priority, weight, port and target, including the root target indicating service unavailability. This diagnostic preserves those fields but does not implement weighted server selection. It inspects every advertised target rather than choosing one and hiding failures in the others. For manual directory discovery, use the [AD DNS guide](/blog/active-directory-domain-controller-not-contacted-dns/).

<span id="query-adapter-preserve-dns-failure-classes"></span>

## Python Example: Classify dnspython SRV and Address Query Errors

Save the following **Python code** as `ad_dns_check.py`. The adapter uses dnspython's documented Resolver interface. It disables search-list expansion by using an absolute query and `search=False`, and separates timeout, NXDOMAIN, NoAnswer and no-usable-nameserver outcomes. NoNameservers is not equivalent to network timeout; inspect resolver-side diagnostics for errors such as SERVFAIL or refusal. See the [dnspython resolver API](https://dnspython.readthedocs.io/en/stable/resolver-class.html).

```python
import json

def dns_query(resolver, name, kind):
    import dns.exception
    import dns.resolver
    try:
        answer = resolver.resolve(name, kind, search=False)
        if kind == "SRV":
            values = [dict(priority=r.priority, weight=r.weight,
                           port=r.port, target=str(r.target)) for r in answer]
        else:
            values = [str(r) for r in answer]
        return {"status": "answer", "values": values}
    except dns.resolver.NXDOMAIN:
        return {"status": "nxdomain", "values": []}
    except dns.resolver.NoAnswer:
        return {"status": "no_answer", "values": []}
    except dns.exception.Timeout:
        return {"status": "timeout", "values": []}
    except dns.resolver.NoNameservers:
        return {"status": "no_nameservers", "values": []}
    except dns.exception.DNSException:
        return {"status": "dns_error", "values": []}

def inspect_discovery(query, name):
    srv = query(name, "SRV")
    report = {"query": name, "srv": srv, "targets": [],
              "scope": "DNS dependencies only"}
    if srv["status"] != "answer":
        report["status"] = "discovery_failed"
        return report
    for record in srv["values"]:
        target = record["target"]
        if target == ".":
            report["targets"].append({**record, "status": "service_unavailable"})
            continue
        addresses = {kind: query(target, kind) for kind in ("A", "AAAA")}
        usable = any(v["status"] == "answer" and v["values"]
                     for v in addresses.values())
        complete = all(v["status"] in ("answer", "no_answer")
                       for v in addresses.values())
        report["targets"].append({**record, "addresses": addresses,
                                  "usable_address": usable,
                                  "queries_complete": complete})
    healthy = bool(report["targets"]) and all(
        t.get("usable_address", False) and t.get("queries_complete", False)
        for t in report["targets"])
    report["status"] = "dns_dependencies_ok" if healthy else "partial_or_unavailable"
    return report
```

`dns_dependencies_ok` means the narrow contract is satisfied; it is not a full DNS or AD health certificate. A positive address plus an error in the other family is reported as partial. NXDOMAIN on one address query is not silently downgraded to NoAnswer, even if a previous query returned a value; that contradiction deserves investigation. Duplicate targets are deliberately retained per SRV record in this small example. A production collector should cache per-target queries and bound total records, runtime and concurrency.

<span id="run-offline-fixtures-before-enabling-network-queries"></span>

## Test AD DNS Dependency Reporting with Offline Fixtures

Append this **synthetic fixture**. Running `python ad_dns_check.py` at this point uses only the provided dictionary, with no dnspython import or network request:

```python
if __name__ == "__main__":
    name = "_ldap._tcp.dc._msdcs.example.test."
    rows = {
        (name, "SRV"): {"status": "answer", "values": [
            dict(priority=0, weight=100, port=389, target="dc01.example.test.")]},
        ("dc01.example.test.", "A"): {"status": "answer", "values": ["192.0.2.10"]},
        ("dc01.example.test.", "AAAA"): {"status": "no_answer", "values": []},
    }
    report = inspect_discovery(lambda name, kind: rows[(name, kind)], name)
    assert report["status"] == "dns_dependencies_ok"
    rows[("dc01.example.test.", "AAAA")] = {"status": "timeout", "values": []}
    partial = inspect_discovery(lambda name, kind: rows[(name, kind)], name)
    assert partial["status"] == "partial_or_unavailable"
    assert partial["targets"][0]["usable_address"] is True
    print("2 offline fixtures passed")
```

Expected output is `2 offline fixtures passed`. The fixture proves dependency reporting for its synthetic cases, not real Resolver exception behavior. Keep separate fixture coverage for discovery failure, missing target addresses and root target before adopting the example in a collector.

{% include blog-diagram.html src="/assets/images/diagrams/python-ad-dns-srv-health-check-flow.svg" scrollable=true alt="Decision flow checks SRV discovery response, usable target address and completeness of both family queries before reporting the narrow DNS dependency result" caption="Report partial success without implying LDAP reachability or successful domain discovery by Windows." %}

<span id="enable-a-small-approved-live-check-explicitly"></span>

## Run an Approved AD DNS Check with an Explicit Resolver

**Network collection change:** create an isolated Python environment and install an organization-approved, pinned dnspython 2.x version. This local article review does not install or query it. After that review, a separate caller can construct the resolver and invoke the functions:

```python
import json
import dns.resolver
from ad_dns_check import dns_query, inspect_discovery
resolver = dns.resolver.Resolver(configure=False)
resolver.nameservers = ["192.0.2.53"]
resolver.timeout = 2.0
resolver.lifetime = 4.0
result = inspect_discovery(
    lambda name, kind: dns_query(resolver, name, kind),
    "_ldap._tcp.dc._msdcs.example.test.")
print(json.dumps(result, indent=2))
```

Save that as a separate caller importing `dns_query` and `inspect_discovery` from `ad_dns_check`; do not append it to the offline fixture run unless live collection is intended. Nameserver selection is explicit so a public resolver is not mistaken for an AD resolver. The lifetime limit is per question, not a whole-run deadline; two families times multiple targets can take substantially longer. Bound the complete job and authorized target count in production.

Verify the selected resolver, exact absolute query and per-target outcomes against an authorized manual lookup before rollout. A DNS-valid target may still be unreachable or advertise the wrong service port; investigate those separately. For actual directory failures, preserve evidence and consult the [AD discovery guide](/blog/active-directory-domain-controller-not-contacted-dns/). Clock-sensitive authentication has its own [Windows Time checks](/blog/windows-time-not-synchronizing-domain/).

Rollback disables the scheduled caller and restores the prior reporting/template configuration, retaining the raw query outcomes securely. The script performs no DNS updates and authorizes no record deletion. Correct authoritative DNS through its owner after the failed dependency is proven; do not remove an SRV target merely because one bounded poll timed out.
