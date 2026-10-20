---
expertise: automation
layout: post
title: 'Python Network Automation with Netmiko: Multi-Vendor User Management'
description: 'Plan multi-vendor user management with Python and Netmiko: inventory, SSH sessions, prompt handling, configuration checks and per-device results.'
thumbnail: /assets/images/blog/python-netmiko-automation.png
date: 2025-05-18
author: Imran Sarwar
tags:
- Python network automation
- Python network automation with Netmiko
- multi-vendor user management
- Netmiko prompt detection
excerpt: 'Plan multi-vendor user management with Python and Netmiko: inventory, SSH sessions, prompt handling, configuration checks and per-device results.'
modified_date: '2026-10-20T12:00:00+04:00'
search_terms:
- Python network automation with Netmiko
- multi-vendor user management
- Netmiko prompt detection
- network configuration auditing
takeaways:
- Separate inventory, platform-specific commands and verification.
- Investigate timeouts before retrying configuration changes.
- Keep per-device results and a recovery plan.
article_type: Implementation walkthrough
topic_label: Python network automation
related_projects:
- title: Python multi-vendor user management and configuration auditing
  url: /projects/2025-06-27-multi-vendor-user-creation/
related_posts:
- acl-update-multi-vendor
- netmiko-netconf-restconf
service_url: /network-automation-services/#request-engineering-support
image_alt: 'Python Network Automation with Netmiko: Multi-Vendor User Management — illustrative article cover'
cta_title: Need help with a Python network automation workflow?
cta_text: Share the script behavior, device platforms, sanitized error and expected result. We can assess a targeted debugging, implementation or configuration-check task.
seo_title: Python Network Automation with Netmiko
---




Python network automation with Netmiko can turn a repeated device task into a workflow with defined inputs and reviewable results. User management is a useful example: the intended account policy may be consistent, while the commands and commit behavior differ across platforms.

My multi-vendor automation project documents inventory classification, account workflows, configuration auditing and CLI troubleshooting. This article explains the design decisions behind that work. It is not a universal script that can be pasted into every network.

## Build a reliable inventory for multi-vendor Netmiko jobs

A device list needs more than an IP address. Record the platform, management address, access method, intended task and whether the device is in scope. Check duplicates, missing fields and unsupported types before opening sessions.

Keep credentials outside source code and ordinary inventory exports. Use the access method approved for the environment and verify server identity. A readable inventory improves troubleshooting because a failed result can be traced back to a specific target and handler.

{% include blog-diagram.html src="/assets/images/diagrams/netmiko-workflow.svg" alt="Python Netmiko workflow from inventory classification to device verification" caption="Conceptual workflow based on the documented multi-vendor project; no performance benchmark is implied." %}

## Separate connection logic from vendor commands

Netmiko helps manage CLI sessions across device platforms. It does not make one vendor's account commands valid on another. Keep a small, reviewable command mapping and confirm the required privilege and configuration mode for each supported platform.

My [implementation case study]({{ '/projects/2025-06-27-multi-vendor-user-creation/' | relative_url }}) describes the platform and timing problems encountered. The [official Netmiko documentation](https://ktbyers.github.io/netmiko/) explains the library's role in show-command retrieval and configuration sessions.

## What my public Netmiko scripts actually implement

The [Cisco IOS user-creation script](https://github.com/Imran5693/network-user_manage-automation/blob/c0fb973c1986366fd6973781f6e933726e1ecb88/Cisco%20IOS/Create_user.py#L23-L75) provides a concrete example. It reads an Excel inventory with pandas, renames the device, IP and hostname columns, filters rows to `cisco ios` and drops rows missing an address or hostname. It then opens a `cisco_ios` connection, enters enable mode, sends the account configuration, reads back matching configuration, saves it and writes a per-device log.

This inventory-filtering excerpt is taken from that script. It opens no device session:

```python
df = pd.read_excel(EXCEL_PATH)
df = df.rename(columns={
    'Device Type': 'device_type',
    'IP Address': 'ip',
    'Hostname': 'hostname'
})
df_ios = df[df['device_type'].str.lower() == 'cisco ios'].dropna(
    subset=['ip', 'hostname']
)
```

The useful separation is inventory selection before connection. However, this expression does not validate IP syntax, remove duplicate targets or normalize whitespace in platform values. Those are additional acceptance checks, not features I claim this version already implements.

The [H3C user-creation script](https://github.com/Imran5693/network-user_manage-automation/blob/c0fb973c1986366fd6973781f6e933726e1ecb88/H3C%20hp/h3c_user_creation.py#L49-L85) takes a different CLI path: `hp_comware`, `read_until_prompt()`, timing-based command delivery, configuration readback and an interactive save sequence. That is a real example of why multi-vendor network automation needs separate platform handlers rather than one universal command block.

### Why does configuration readback still need acceptance checks?

The Cisco script stores returned configuration, but it does not parse that text into an explicit expected-account and privilege assertion. Its success message therefore describes reaching the end of the workflow; it is not an independently verified account-policy result. A stronger next version would compare the returned state with the requested state and report `verified`, `failed` or `unknown` separately.

There is also a platform-review lesson in the [HP-labelled script](https://github.com/Imran5693/network-user_manage-automation/blob/c0fb973c1986366fd6973781f6e933726e1ecb88/HP_Procurv/hp_proc-user_creation.py#L39-L82): it selects `hp_procurve` but includes commands such as `system-view` and `display current-configuration`. That inconsistency needs checking against the actual operating system before reuse. I would not present this file as a validated ProCurve template.

The [repository README](https://github.com/Imran5693/network-user_manage-automation/blob/c0fb973c1986366fd6973781f6e933726e1ecb88/README.md) labels the published examples as lab demonstrations. These source links establish what the code contains; they do not establish production deployment, execution success or measured time savings. Credentials and full device configurations are deliberately excluded from the excerpts here.

## How can you test a read-only Netmiko connection first?

Start with one authorized Cisco IOS/IOS XE target in GNS3 or EVE-NG. Confirm management reachability, SSH access and the device host key outside this script. Install Netmiko in an isolated Python environment and record `python --version` and `python -m pip show netmiko`. This example uses Netmiko 4.x APIs and requires validation against your installed version and device image; it has not been executed against a lab device for this revision.

```bash
python -m venv .venv
# Activate .venv using the command for your operating system.
python -m pip install "netmiko>=4,<5"
```

Set `LAB_HOST` to the approved management IP and `LAB_USERNAME` to a read-only account in your shell. The script prompts for the password instead of embedding it. Add the independently verified host key to your user's known-hosts file before running. It deliberately rejects an unknown or changed key.

```python
import ipaddress
import json
import os
from getpass import getpass

from netmiko import ConnectHandler
from netmiko.exceptions import (
    NetmikoAuthenticationException,
    NetmikoTimeoutException,
    ReadTimeout,
)
from paramiko.ssh_exception import SSHException


def main():
    host = os.environ.get("LAB_HOST", "").strip()
    username = os.environ.get("LAB_USERNAME", "").strip()
    try:
        ipaddress.ip_address(host)
    except ValueError:
        raise SystemExit("Set LAB_HOST to an approved lab management IP.")
    if not username:
        raise SystemExit("Set LAB_USERNAME to your authorized lab account.")

    result = {"host": host, "status": "failed", "reason": None}
    try:
        with ConnectHandler(
            device_type="cisco_ios",
            host=host,
            username=username,
            password=getpass("Lab SSH password: "),
            ssh_strict=True,
            system_host_keys=True,
            conn_timeout=10,
            auth_timeout=15,
            banner_timeout=15,
        ) as connection:
            output = connection.send_command("show version", read_timeout=30)
            if not output.strip():
                result["reason"] = "empty_output"
            elif any(marker in output for marker in (
                "% Invalid input", "% Authorization failed", "% Error"
            )):
                result["reason"] = "cli_rejected"
            else:
                result.update(status="collected", reason=None)
                result["output_characters"] = len(output)
    except NetmikoAuthenticationException:
        result["reason"] = "authentication_failed"
    except ReadTimeout:
        result["reason"] = "command_read_timeout"
    except NetmikoTimeoutException:
        result["reason"] = "connection_timeout"
    except SSHException:
        result["reason"] = "ssh_or_host_key_error"
    except (OSError, EOFError):
        result["reason"] = "transport_or_local_io_error"

    print(json.dumps(result))
    return 0 if result["status"] == "collected" else 1


if __name__ == "__main__":
    raise SystemExit(main())
```

`collected` means nonempty output arrived without the small set of known CLI rejection markers. It does **not** certify the device version, account policy or configuration compliance. Add an image-specific parser and explicit assertions for those outcomes. The marker list is illustrative, not a complete Cisco error parser.

The script sends no configuration or save commands and prints no raw device output, password or exception text. The result still identifies a management address; protect it appropriately. If you enable session logging for diagnosis, treat that log as sensitive and redact it before sharing.

Test the normal connection, unreachable host, wrong credentials and changed host key separately. A wrong-credential test may trigger account lockout, so follow your lab's account policy. Validate timeout behavior without interpreting a connection timeout as evidence that a configuration change failed.

## Diagnose prompt detection and timeout failures

A timeout can mean the command is slow, the session is waiting for interaction, the prompt differs from expectations or the connection has failed. Capture a sanitized session trace and reproduce the behavior on one authorized target.

Distinguish authentication failures, privilege failures, incomplete output and command rejection. Increasing every delay may hide a diagnosis problem and make failures slower. Check the behavior and the installed library version before changing timing options.

For a configuration command, a timeout also creates uncertainty: the change may already have been applied. Verify state before retrying. A blind retry is especially risky for operations that are not safe to repeat.

## Verify the result, not only the session

Define a check for each intended outcome. Did the account exist before the run? Does it have the intended privilege? Was the change committed or saved as the platform requires? Did the session return an error that the script ignored?

A useful result record includes the target, task, start/end time, status, verification evidence and exception. Avoid putting passwords or sensitive configuration into logs. Keep failed and skipped devices visible rather than treating a completed loop as full success.

## Example acceptance checks for user automation

Use a small approved target set and record the starting state before execution. The table describes illustrative test cases, not new test results from my project.

| Case | Check before execution | Evidence needed afterward |
| --- | --- | --- |
| Account already has the intended state | Confirm the current role and target | No unintended duplicate or privilege change |
| Device rejects a command | Confirm the selected platform and privilege | Rejection captured as a failed task, not reported as success |
| Session times out after a change request | Record which command was attempted | Read back state before deciding whether a retry is safe |
| One target is unreachable | Confirm inventory and scope | That target is reported separately from verified devices |

This record is more useful than a single message saying the script finished. It makes partial success visible and gives the next engineer a starting point for investigation.

## Define an acceptance test for the automation workflow

Start with a lab device or a limited approved group. Test a normal case, an unreachable device, a wrong privilege, an unsupported platform and an already-correct state. Agree on change approval and recovery arrangements before production execution.

Use the [ACL change review]({{ '/2025/08/17/acl-update-multi-vendor.html' | relative_url }}) for policy-specific validation and the [interface comparison guide]({{ '/blog/netmiko-netconf-restconf-python-network-automation/' | relative_url }}) when deciding between CLI automation and model-driven APIs. If a current script is failing, include the sanitized error, device version and expected outcome in a [remote automation inquiry]({{ '/network-automation-services/#request-engineering-support' | relative_url }}).
