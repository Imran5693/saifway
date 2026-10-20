---
layout: "post"
title: "Network Configuration Backup with Netmiko: How Do You Handle Failed Devices?"
seo_title: "Network Configuration Backup with Netmiko: How Do You Handle Failed Devices?"
description: "Build a Netmiko configuration capture workflow with atomic files, inventory validation and per-device failure reports. Includes a proposed GNS3/EVE-NG lab."
date: "2026-10-20T10:44:27+04:00"
editorial_date: "2025-07-08"
created_date: "2026-10-19"
modified_date: "2026-10-20T10:44:27+04:00"
permalink: "/blog/netmiko-backup-failed-devices/"
author: "Imran Sarwar"
expertise: "automation"
thumbnail: "/assets/images/blog/netmiko-backup-failed-devices.webp"
image: "/assets/images/blog/netmiko-backup-failed-devices.webp"
thumbnail_width: 1729
thumbnail_height: 910
image_alt: "Independent configuration backup paths with one failed device — conceptual illustration"
article_type: "Practical guide and proposed lab"
topic_label: "CLI automation"
review_collection: "automation-2026"
review_draft: false
published: true
sitemap: true
robots: "index, follow"
tags: ["network configuration backup", "netmiko backup script exception handling", "backup multiple devices python"]
search_terms: ["network configuration backup", "netmiko backup script exception handling", "backup multiple devices python"]
takeaways: ["Keep an outcome for every approved inventory entry.", "Reject CLI errors and incomplete IOS-style captures.", "Store captures atomically and checkpoint a failure manifest.", "Report capture freshness separately from restore validation."]
related_posts: ["nornir-retry-failed-hosts", "python-network-config-drift", "napalm-state-compliance-report", "netmiko-readtimeout-troubleshooting", "netmiko-netconf-restconf-python-network-automation"]
service_url: "/network-automation-services/#request-engineering-support"
cta_title: "Need reliable backups across a mixed device estate?"
cta_text: "Share the device families, inventory source and current backup failure behavior. I can assess a scoped Netmiko collector, failure manifest or dashboard integration."
---

**Network configuration backup** fails operationally when the scheduler reports a successful process but nobody can identify which devices produced usable captures. A file can contain a CLI authorization error. A job can stop after its first unreachable switch. A successful capture can still be unsuitable for recovery.

**Lab status:** This is a proposed exercise, not a completed device test or client case study. Code examples require validation against your image and dependency versions. My documented background is NOC/data center operations, multi-vendor Netmiko workflows and Python/Flask integration.

*A Netmiko collection workflow with per-device outcomes, atomic files and an honest recovery boundary.*

## What does the IOS configuration capture include?

The example reads `show running-config` from an approved inventory of IOS/IOS XE devices using Netmiko's `cisco_ios` driver. It stores each accepted response in a unique run directory and writes a JSON manifest. It does not save running configuration to startup, enter configuration mode, or restore anything. Session preparation can adjust terminal behavior.

Use Python 3.10+ and **Netmiko 4.7.0** for this exercise. That is an explicit example baseline, not a recommendation that it is the latest release. Freeze transitive dependencies after testing in your own environment. The source was revised in October 2026; its earlier editorial slot is not a claim that these dependencies were used in 2025.

| Boundary | Evidence recorded | What it does not prove |
|---|---|---|
| Connection | A session authenticated to a trusted SSH host key | The account can read every configuration section |
| Collection | The command returned before its read deadline | Output is complete or semantically correct |
| Acceptance | Expected hostname/end markers; no recognized CLI error or pager | Every feature needed for recovery is present |
| Storage | File path, byte count, SHA-256 and UTC capture time | The original response was complete |
| Recovery | Explicit `restore_verified: false` | A restore has been exercised |

Running and startup configurations can differ. A startup capture is a separate requirement with a separate command and acceptance profile. Certificates, private keys, licenses, boot images and external AAA dependencies may require other recovery procedures. Do not collapse these into one green “backup OK” tile.

## Why can nonempty command output still be an invalid backup?

This example deliberately rejects any line starting with `%`, a pagination marker, a missing hostname or a missing final `end`. These are conservative **IOS-specific heuristics**. A banner containing a percent-prefixed line can trigger a false rejection. A restricted configuration view may still pass. Capture the failure category and have an operator inspect restricted evidence; do not weaken the validator until every device appears green.

The per-device handler catches ordinary exceptions so the next device can be attempted. A manifest write failure is different: the job stops because it can no longer report outcomes reliably. The initial manifest lists every target as `pending`; interrupted runs retain unfinished targets instead of pretending they disappeared.

**Multi-vendor boundary:** the Python control flow is reusable, but the acceptance profile is not. Junos hierarchical output does not end with IOS `end`; EOS, NX-OS and other systems need their own commands, privilege checks and fixtures. Add a reviewed profile per platform rather than changing a driver name and assuming the same validator remains valid.

{% include blog-diagram.html src="/assets/images/diagrams/netmiko-backup-failed-devices.svg" alt="Keep each device backup independently accountable" caption="Conceptual diagnostic sequence; no measured outcomes or real device screenshots are shown." %}

## Proposed GNS3/EVE-NG lab: isolate collection and storage failures

1. Add a Linux automation VM and two licensed IOS/IOS XE images to an isolated management network. Choose images your lab supports. Record image filenames, `show version`, Python version and dependency lock file. No particular image release has been device-tested for this article.
2. Give the VM a management path to both devices. Use a dedicated collection account with authorization for `show running-config`. This example assumes sufficient privilege on login; it does not automatically issue `enable`.
3. Verify SSH fingerprints through a trusted console or inventory, then populate a dedicated `known_hosts` file. `ssh-keyscan` alone discovers keys; it does not authenticate them. Keep strict checking enabled when an image is replaced, and investigate the changed key.
4. Create an approved JSON inventory. Replace the documentation addresses below with your isolated lab addresses. The third entry should represent a deliberately unreachable lab target, never an arbitrary external host.
5. Create the output directory outside the website, source repository and shared web root. On Linux use a private parent directory and restrictive umask. On Windows configure NTFS ACLs; Python's POSIX mode argument does not establish equivalent Windows access control.
6. Run once with the unreachable target between the two reachable devices. Confirm the final device is attempted and inspect all three manifest entries. Separately test a denied command and a storage failure. Keep console access for recovery.

```json
[
  {"id": "r1", "host": "192.0.2.11", "device_type": "cisco_ios"},
  {"id": "unreachable", "host": "192.0.2.99", "device_type": "cisco_ios"},
  {"id": "r2", "host": "192.0.2.12", "device_type": "cisco_ios"}
]
```

Save as `inventory.json`. On the Linux lab VM:

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install "netmiko==4.7.0"
python -m pip freeze > requirements.lock.txt
umask 077
mkdir -m 700 captures
python backup.py inventory.json captures ./known_hosts
echo $?
```

The account password is prompted without echo. For unattended work, replace the prompt with an approved secret-manager integration; do not place passwords in the inventory, command line or Git history.

## Python: collect configurations and checkpoint a failure manifest

Save the following as `backup.py`. It runs sequentially, validates all inventory entries before connecting, and refuses unsupported platform profiles or duplicate identifiers. Filenames come from constrained IDs rather than device-supplied text.

**Data protection:** configuration captures can contain credentials, community strings and internal topology. The files are not encrypted by this script. Use a restricted local filesystem with encryption and retention controls appropriate to the client. Do not enable verbose session logging into a shared directory.

```python
"""IOS/IOS XE capture exercise. No restore or configuration changes."""
import argparse
from datetime import datetime, timezone
import getpass
import hashlib
import json
import os
from pathlib import Path
import re
import tempfile
import uuid


def atomic_write(path, data):
    # Caller supplies a private, trusted directory on a local filesystem.
    fd, tmp = tempfile.mkstemp(dir=path.parent, prefix='.capture-')
    try:
        with os.fdopen(fd, 'wb') as stream:
            stream.write(data)
            stream.flush()
            os.fsync(stream.fileno())
        os.replace(tmp, path)
    finally:
        if os.path.exists(tmp):
            os.unlink(tmp)


def validate_ios(text):
    # Conservative heuristics, NOT a completeness or restore proof.
    if not isinstance(text, str) or not text.strip():
        raise ValueError('empty_or_nontext')
    if re.search(r'(?im)^\s*%|--More--|authorization failed', text):
        raise ValueError('cli_error_or_paging')
    if not re.search(r'(?m)^hostname\s+\S+', text):
        raise ValueError('missing_hostname')
    if not re.search(r'(?m)^end\s*\Z', text.strip()):
        raise ValueError('missing_end')
    return text.encode('utf-8')


def validate_inventory(devices):
    if not isinstance(devices, list) or not devices:
        raise ValueError('inventory_must_be_nonempty_list')
    names, targets = set(), set()
    for d in devices:
        if not isinstance(d, dict) or set(d) != {'id', 'host', 'device_type'}:
            raise ValueError('inventory_fields')
        if not isinstance(d['id'], str) or not re.fullmatch(r'[A-Za-z0-9_-]{1,48}', d['id']):
            raise ValueError('unsafe_device_id')
        if d['device_type'] != 'cisco_ios':
            raise ValueError('unsupported_profile')
        if not isinstance(d['host'], str) or not d['host'] or any(c.isspace() for c in d['host']):
            raise ValueError('invalid_host')
        if d['id'].lower() in names or d['host'].lower() in targets:
            raise ValueError('duplicate_inventory_entry')
        names.add(d['id'].lower())
        targets.add(d['host'].lower())


def collect(devices, root, connect, username, password, known_hosts):
    validate_inventory(devices)  # Fail the whole job before any SSH if malformed.
    run_id = datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ') + '-' + uuid.uuid4().hex[:8]
    run = root / run_id
    run.mkdir(mode=0o700)  # Parent must exist and be access-controlled.
    rows = [{'id': d['id'], 'status': 'pending', 'restore_verified': False} for d in devices]
    manifest = {'run_id': run_id, 'complete': False, 'results': rows}

    def checkpoint():
        atomic_write(run / 'manifest.json', json.dumps(manifest, indent=2).encode())

    checkpoint()  # Storage failure here prevents all collection.
    for d, row in zip(devices, rows):
        stage = 'connect'
        try:
            with connect(host=d['host'], device_type=d['device_type'],
                         username=username, password=password,
                         ssh_strict=True, alt_host_keys=True,
                         alt_key_file=str(known_hosts), allow_agent=False,
                         use_keys=False, conn_timeout=10, auth_timeout=15,
                         banner_timeout=15) as conn:
                stage = 'collect'
                text = conn.send_command('show running-config', read_timeout=60)
            stage = 'validate'
            payload = validate_ios(text)
            stage = 'store'
            filename = d['id'] + '.cfg'
            atomic_write(run / filename, payload)
            row.update(status='captured_unverified', file=filename,
                       bytes=len(payload), sha256=hashlib.sha256(payload).hexdigest(),
                       captured_at=datetime.now(timezone.utc).isoformat())
        except Exception as exc:
            # Deliberate per-device boundary. Never print raw config/exception text.
            row.update(status='failed', stage=stage, error_class=type(exc).__name__)
        checkpoint()  # Fatal if reporting fails: never continue a silent job.
    manifest['complete'] = True  # Finished attempting inventory, not all succeeded.
    checkpoint()
    return run, rows


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('inventory', type=Path)
    parser.add_argument('output_root', type=Path)
    parser.add_argument('known_hosts', type=Path)
    args = parser.parse_args()
    from netmiko import ConnectHandler
    try:
        if not args.known_hosts.is_file() or not args.output_root.is_dir():
            raise ValueError('missing_known_hosts_or_private_output_directory')
        devices = json.loads(args.inventory.read_text(encoding='utf-8'))
        validate_inventory(devices)
        username = input('SSH username: ').strip()
        password = getpass.getpass('SSH password: ')
        run, rows = collect(devices, args.output_root, ConnectHandler,
                            username, password, args.known_hosts)
        print(json.dumps({'run': run.name, 'attempted': len(rows),
                          'failed': sum(r['status'] == 'failed' for r in rows)}))
        return 1 if any(r['status'] == 'failed' for r in rows) else 0
    except Exception as exc:
        print(json.dumps({'status': 'job_failed', 'error_class': type(exc).__name__}))
        return 2


if __name__ == '__main__':
    raise SystemExit(main())
```

`os.replace` commits the temporary file in the same directory. The script flushes file contents before replacing the destination. This reduces partial-file exposure; it is not a guarantee of crash durability across every filesystem. It does not fsync directory metadata or validate network-share semantics. Use a local trusted directory and test the intended storage backend before deployment.

The manifest is checkpointed after every attempt. A crash between file commit and manifest commit can leave an orphan capture with a pending entry. Reconcile it using the run directory and operator review; never infer a successful backup merely because a `.cfg` file exists. There is no concurrent writer in this exercise.

## Which failed captures should you retry?

| Result | Meaning | Operator action |
|---|---|---|
| Exit 0 | All targets produced stored captures that passed these heuristics | Review capture freshness and schedule restore validation |
| Exit 1 | Job completed, at least one device failed | Read its stage and error class; scope a new run to eligible failures |
| Exit 2 | Setup or job/reporting failure | Treat coverage as unknown until the incomplete manifest is reviewed |
| `pending` with `complete: false` | Interrupted or still-running job | Check worker status; do not count it as success |
| `validate` failure | Unexpected content or profile mismatch | Inspect a restricted manual capture and the platform profile |
| `store` failure | Local file operation failed | Check capacity, permissions and storage health |

Do not retry an authentication failure in a loop: account lockout can turn one failure into a fleet incident. A read timeout is not necessarily a management-network outage. Check command authorization, paging, prompt detection and device load before increasing deadlines. If failures cluster at a physical site, correlate management-interface errors, loss, routing and AAA response times. Python cannot diagnose a bad optic from a timeout alone.

## Dashboard reporting: coverage, freshness and restore validation

Keep at least three separate metrics: **inventory coverage**, **freshness within the agreed window**, and **restore-validation coverage**. For this script, capture coverage is `captured_unverified / approved inventory entries`; restore-validation coverage remains unmeasured. A completed job with failures is a completed attempt, not a healthy estate.

A Flask or Django application should read a restricted metadata store through a background ingestion worker. Never serve the capture directory as static content or accept arbitrary filenames from a request. Apply tenant access checks to device IDs, escape displayed strings and keep raw captures behind separate authorization and audit logging. Preserve the last successful capture time alongside the latest failed attempt so stale evidence remains visible.

For USA, UK and Canadian operations teams, store timestamps in UTC and display the site's agreed timezone. Define where configurations may be stored, who can retrieve them, and which support window owns failed captures. Location-specific service expectations do not change the technical meaning of `captured_unverified`.

Use an established backup platform when its inventory, retention, access and restore workflows already meet the requirement. A custom collector is justified by a specific integration or unsupported profile, not merely by the availability of a Python library.

## Validation record: offline tests and pending restore checks

Local synthetic tests exercise mixed success/failure collection, invalid and truncated captures, duplicate/path-unsafe inventory, file-write failure and fatal manifest failure. They use a fake connector and temporary files. They do not authenticate to a router or establish POSIX/NTFS protection on your deployment host.

Before production use, compare captures with authorized manual output, test actual SSH rejection and command denial, verify storage permissions with a second account, and perform a scoped restore in a disposable lab. Document exactly what was restored. No device restore or GNS3/EVE-NG run is claimed here.

## What should a configuration-backup integration include?

I can review an existing Netmiko workflow, define per-platform capture acceptance, and scope a failure report or Flask dashboard integration. Bring a sanitized inventory shape, device families, current failure categories and recovery requirements. [Request a remote automation scope review]({{ '/network-automation-services/#request-engineering-support' | relative_url }}).

## Related troubleshooting and implementation

Explore the [network automation troubleshooting collection]({{ '/blog/network-automation-troubleshooting/' | relative_url }}) to connect this issue to adjacent workflows. The [Netmiko, NETCONF and RESTCONF comparison]({{ '/blog/netmiko-netconf-restconf-python-network-automation/' | relative_url }}) helps when you are choosing an interface rather than fixing an existing implementation.

## Technical references

- [Netmiko 4.7.0 release baseline](https://pypi.org/project/netmiko/4.7.0/)
- [Netmiko 4.7.0 connection and command implementation](https://github.com/ktbyers/netmiko/blob/v4.7.0/netmiko/base_connection.py)
