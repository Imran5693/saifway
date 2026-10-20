---
layout: "post"
title: "Python SSL Certificate Expiry Check: How Do You Handle Failed Connections?"
seo_title: "Python SSL Certificate Expiry Check: How Do You Handle Failed Connections?"
description: "Check TLS certificate expiry across approved inventory with Python, verified TLS, failure categories and last-success timestamps. Live probes remain untested."
date: "2026-10-20T10:44:27+04:00"
editorial_date: "2026-09-22"
created_date: "2026-10-19"
modified_date: "2026-10-20T10:44:27+04:00"
permalink: "/blog/python-tls-certificate-expiry/"
author: "Imran Sarwar"
expertise: "automation"
thumbnail: "/assets/images/blog/python-tls-certificate-expiry.webp"
image: "/assets/images/blog/python-tls-certificate-expiry.webp"
thumbnail_width: 1536
thumbnail_height: 1024
image_alt: "A certificate validity calendar feeding a monitoring panel — conceptual illustration"
article_type: "Practical guide and proposed lab"
topic_label: "Infrastructure diagnostics"
review_collection: "automation-2026"
review_draft: false
published: true
sitemap: true
robots: "index, follow"
tags: ["python ssl certificate expiry check", "python tls certificate monitoring", "ssl expiry monitoring dashboard"]
search_terms: ["python ssl certificate expiry check", "python tls certificate monitoring", "ssl expiry monitoring dashboard"]
takeaways: ["Keep hostname and certificate verification enabled.", "A failed handshake is not a healthy certificate result.", "Expiry monitoring does not replace complete service monitoring."]
related_posts: ["ubuntu-dns-netplan-troubleshooting", "sdwan-certificate-control-errors", "windows-update-proxy-errors", "netmiko-readtimeout-troubleshooting", "netmiko-netconf-restconf-python-network-automation"]
service_url: "/network-automation-services/#request-engineering-support"
cta_title: "Need a certificate expiry dashboard?"
cta_text: "I can scope an approved endpoint inventory, verified TLS checks and alert/reporting logic. Share the service list, internal CA requirements and preferred warning thresholds."
---

A certificate expiry script can be useful, but a green dashboard is misleading if failed connections disappear from the report. Keep certificate validation enabled and represent unreachable, untrusted or mismatched services as distinct failures.

**Lab status:** This is a proposed exercise, not a completed device test or client case study. Code examples require validation against your image and dependency versions. My documented background is NOC/data center operations, multi-vendor Netmiko workflows and Python/Flask integration.

**Offline example checks:** October 20, 2026: the added helper/demo block executed with local fixtures, and related negative cases were checked offline. No live device, controller, fabric or service behavior was validated.

## What does a verified TLS expiry check establish?

It measures the validity deadline of the certificate presented by a service during a successful TLS connection. Python's default client context validates certificate trust and hostname when used correctly. This does not prove that the application is healthy, that renewal will succeed or that every load-balanced backend has the same certificate.

A successful verified handshake identifies the presented service certificate and its validity data. It does not test application health, renewal automation, every load-balanced backend or non-direct TLS protocols. An expired certificate may fail verification before a date is available.



## Why do hostname verification and SNI matter?

Use the approved hostname for SNI and identity verification while trusting the organization's approved CA bundle. An IP-only probe can select another virtual host. Keep a private CA trust failure visible; do not retry with verification disabled to extract a reassuring expiry date.





{% include blog-diagram.html src="/assets/images/diagrams/python-tls-certificate-expiry.svg" alt="Validate TLS before reporting expiry" caption="Conceptual diagnostic sequence; no measured outcomes or real device screenshots are shown." %}

## Proposed TLS lab: separate expiry from connection failures

Use a disposable TLS service with a trusted test CA. Plan valid, unreachable, wrong-hostname and expired cases, retaining the service configuration separately from the report. Those live TLS cases remain untested here; injected probes exercise only the reporting logic.



## Python: inspect certificate expiry with verified TLS

The new inventory wrapper retains one result per approved endpoint, separate DNS/verification/timeout categories and the prior last-success timestamp on failures. Supply endpoint IDs, hostnames, optional ports and optional CA files from protected inventory. Save returned metadata in an access-controlled store rather than serving arbitrary targets from a web form.

```python
import os
import socket
import ssl
from datetime import datetime, timezone

host = os.environ["TLS_HOST"]
context = ssl.create_default_context(cafile=os.environ.get("TLS_CA_FILE"))
try:
    with socket.create_connection((host, 443), timeout=5) as raw:
        with context.wrap_socket(raw, server_hostname=host) as tls:
            cert = tls.getpeercert()
    expiry = datetime.fromtimestamp(
        ssl.cert_time_to_seconds(cert["notAfter"]), timezone.utc
    )
    days = (expiry - datetime.now(timezone.utc)).total_seconds() / 86400
    print({"host": host, "status": "warning" if days < 30 else "ok",
           "days_remaining": round(days, 2), "expires_at": expiry.isoformat()})
except ssl.SSLCertVerificationError:
    print({"host": host, "status": "certificate-validation-failed"})
except (OSError, ssl.SSLError, KeyError, ValueError):
    print({"host": host, "status": "check-failed"})
```


### Worked Python example and input contract

```python
import socket
import ssl
from datetime import datetime, timezone

def tls_inventory(endpoints, previous=None, probe=None):
    previous = previous or {}
    ids = []
    for item in endpoints:
        if not isinstance(item, dict) or not isinstance(item.get('id'),str) or not item['id']:
            raise ValueError('endpoint_id_required')
        host = item.get('host')
        if not isinstance(host,str) or not host or any(c.isspace() for c in host):
            raise ValueError('inventory_hostname_required')
        port = item.get('port',443)
        if type(port) is not int or not 1 <= port <= 65535:
            raise ValueError('invalid_port')
        ids.append(item['id'])
    if len(set(ids)) != len(ids):
        raise ValueError('duplicate_endpoint_id')
    def real_probe(item):
        context = ssl.create_default_context(cafile=item.get('ca_file'))
        with socket.create_connection((item['host'],item.get('port',443)),timeout=5) as raw:
            with context.wrap_socket(raw, server_hostname=item['host']) as tls:
                cert = tls.getpeercert()
        return datetime.fromtimestamp(ssl.cert_time_to_seconds(cert['notAfter']),timezone.utc)
    probe = probe or real_probe
    results = []
    for item in endpoints:
        row = {'id': item['id'], 'checked_at': datetime.now(timezone.utc).isoformat(),
               'last_success_at': previous.get(item['id'],{}).get('last_success_at')}
        try:
            expiry = probe(item)
            if expiry.tzinfo is None:
                raise ValueError('aware_expiry_required')
            days = (expiry-datetime.now(timezone.utc)).total_seconds()/86400
            row.update(state='expired' if days < 0 else 'warning' if days < 30 else 'ok',
                       days_remaining=round(days,2), expires_at=expiry.isoformat(),
                       last_success_at=row['checked_at'])
        except ssl.SSLCertVerificationError:
            row['state'] = 'certificate_verification_failed'
        except socket.gaierror:
            row['state'] = 'dns_failed'
        except TimeoutError:
            row['state'] = 'connection_or_handshake_timeout'
        except (OSError,ssl.SSLError,ValueError,KeyError):
            row['state'] = 'check_failed'
        results.append(row)
    return {'results': results, 'exit_code': 0 if results and all(r['state']=='ok' for r in results) else 1}

def fake_probe(endpoint):
    raise ssl.SSLCertVerificationError('synthetic trust failure')
previous = {'lab-web': {'last_success_at': '2026-10-19T00:00:00+00:00'}}
print(tls_inventory([{'id': 'lab-web', 'host': 'web.example.test'}],
                    previous=previous, probe=fake_probe))  # No network traffic
# Omitting probe uses real verified TLS for approved inventory targets.
```

## What does a single-host check need before becoming a monitor?

The wrapper checks nonempty unique endpoint IDs, hostnames and valid ports before probing. A deployment still needs an approved target allowlist, scheduler, bounded concurrency and a process-level deadline. DNS can outlast a socket timeout, so these examples do not promise a hard total deadline. An empty inventory returns a failing exit code rather than an empty green run. Thresholds and notification ownership need client agreement.



## What should a certificate-monitoring integration deliver?

A client-ready monitor distinguishes latest attempt from last verified success and makes stale evidence visible. Keep renewal ownership, threshold exceptions and escalation routes separate from probe code. For USA, UK and Canadian teams, store UTC timestamps and display agreed regional working windows without implying 24-hour support.





## Related troubleshooting and implementation

Explore the [network automation troubleshooting collection]({{ '/blog/network-automation-troubleshooting/' | relative_url }}) to connect this issue to adjacent workflows. The [Netmiko, NETCONF and RESTCONF comparison]({{ '/blog/netmiko-netconf-restconf-python-network-automation/' | relative_url }}) helps when you are choosing an interface rather than fixing an existing implementation.

## Technical references

- [Python SSL library](https://docs.python.org/3/library/ssl.html)
- [Python socket connections](https://docs.python.org/3/library/socket.html#socket.create_connection)
