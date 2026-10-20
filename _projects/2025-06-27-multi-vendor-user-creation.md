---
expertise: automation
layout: project
title: "Multi-Vendor Configuration Management with Python and Netmiko"
description: "Review a Python and Netmiko project for multi-vendor configuration management: inventory filtering, account workflows, CLI differences and verification limits."
date: 2025-06-27
modified_date: '2026-10-20T12:00:00+04:00'
thumbnail: "/assets/images/projects/multi-vendor_project.png"
tags: [Python Network Automation, Netmiko, Configuration Management, Multi-Vendor Infrastructure]
sitemap: true
---

Multi-vendor configuration management needs more than an SSH loop. Inventory records, privilege transitions, configuration syntax and persistence differ between device operating systems. This Python and Netmiko project explores those boundaries through account-management and configuration scripts.

**Evidence boundary:** the linked public repository contains lab demonstration scripts. Source inspection establishes what those files implement; it does not establish successful execution on every listed platform, production deployment or measured efficiency improvements. The proposed acceptance checks below still require validation against the actual device images and installed library versions.

{% include blog-diagram.html src="/assets/images/diagrams/netmiko-workflow.svg" alt="Inventory, platform selection, command execution and verification in a multi-vendor Netmiko workflow" caption="Conceptual workflow; not a captured production execution." %}

## What does this multi-vendor configuration management project cover?

The repository groups inventory processing, device checks and vendor-specific administrative tasks. Its workflows include local account creation and deletion, credential changes, configuration collection and ACL-related scripts. These are CLI-based operations. They do not establish a universal configuration model, automatic rollback or a compliance engine.

For the SSH implementation details, read [Python network automation with Netmiko]({{ '/2025/05/18/python-network-automation-with-netmiko.html' | relative_url }}). For the choice between CLI and model-driven interfaces, use the [Netmiko, NETCONF and RESTCONF comparison]({{ '/blog/netmiko-netconf-restconf-python-network-automation/' | relative_url }}).

## How does inventory selection affect configuration safety?

The [Cisco IOS account script](https://github.com/Imran5693/network-user_manage-automation/blob/c0fb973c1986366fd6973781f6e933726e1ecb88/Cisco%20IOS/Create_user.py) reads Excel with pandas, renames inventory columns and selects Cisco IOS rows before opening device sessions. Selection matters: an address is not enough to determine which configuration syntax or Netmiko driver is appropriate.

**Review before execution:** normalize platform values, reject missing or malformed addresses, detect duplicate targets, and require an explicitly approved device list. Inventory labels should be checked against device identity. A mistaken label can select a valid SSH driver for the wrong operating system.

## Why do different vendors need separate command handlers?

The Cisco example uses `cisco_ios`, enable mode, configuration commands, readback and save. The [H3C example](https://github.com/Imran5693/network-user_manage-automation/blob/c0fb973c1986366fd6973781f6e933726e1ecb88/H3C%20hp/h3c_user_creation.py) uses `hp_comware`, prompt reads, timing-based delivery and an interactive save sequence. They require different terminal handling as well as different commands.

The [HP-labelled file](https://github.com/Imran5693/network-user_manage-automation/blob/c0fb973c1986366fd6973781f6e933726e1ecb88/HP_Procurv/hp_proc-user_creation.py) selects `hp_procurve` while including `system-view` and `display current-configuration`. That mismatch needs investigation against the actual OS before reuse. A vendor label is not proof of compatibility. This page therefore does not present that file, or the repository's broader platform list, as a validated support matrix.

## What counts as a verified configuration change?

A returned prompt proves that the CLI interaction progressed. It does not prove that the device accepted the intended account policy or persisted it. A complete workflow needs separate results for command acceptance, state verification and save or commit verification.

| Result | Required evidence | Next action |
| --- | --- | --- |
| Verified | Readback matches the requested state; persistence checked separately | Record the evidence and close the task |
| Rejected | CLI or API reports a specific error | Stop that target and investigate syntax, privilege or policy |
| Unknown | Timeout or disconnect after submitting a change | Reconnect and inspect state before retrying |
| Skipped | Unsupported platform or missing approved input | Report the target and reason; do not count it as success |

The current Cisco script collects readback but does not implement a full expected-account and privilege assertion. That distinction is an improvement requirement, not a result already achieved. ACL changes also need traffic and rule-order checks; see the [multi-vendor ACL review]({{ '/2025/08/17/acl-update-multi-vendor.html' | relative_url }}).

## How can you evaluate this workflow in GNS3 or EVE-NG?

Use one authorized, appropriately licensed Cisco IOS/IOS XE lab image and a Python host with SSH access. Add another OS only when you have the image, credentials and a reviewed handler. GNS3/EVE-NG provides the topology; it does not make every vendor image or feature available.

1. Record image versions, Python and Netmiko versions, and the starting account configuration.
2. Verify the target and SSH host key manually. Start with a harmless show command and the read-only example in the [Netmiko walkthrough]({{ '/2025/05/18/python-network-automation-with-netmiko.html#how-can-you-test-a-read-only-netmiko-connection-first' | relative_url }}).
3. Review a disposable local account change and recovery procedure before enabling writes. Keep a separate administrative session available.
4. Compare expected and observed account state, then verify platform-specific persistence. Do not confuse running state with startup or committed state.
5. Exercise an unreachable host, rejected command, wrong privilege and timeout. Report partial completion explicitly and inspect uncertain targets before any retry.

These are proposed tests. No additional device runs or successful lab outcomes are claimed here. Configuration readbacks and SSH logs can contain secrets; restrict access, redact before sharing and define retention.

## When should this become a dashboard or managed workflow?

A dashboard should display per-device verification, skipped targets, uncertain changes and persistence status. Keep SSH execution in a controlled worker rather than an unrestricted web request. Use authentication, approved target scope, bounded concurrency and an audit trail that excludes credentials. A green job status must not hide failed devices.

If your problem is policy compliance, backups or drift detection, define that requirement separately from account management. Different tasks need different parsers, comparison rules and acceptance criteria; this project is an implementation reference, not a claim to cover every configuration-management requirement.

## Need help with a multi-vendor automation workflow?

Review the [Python network automation portfolio]({{ '/network-automation-python/' | relative_url }}) or discuss [Python network automation services]({{ '/network-automation-services/#request-engineering-support' | relative_url }}). Share sanitized inventory columns, device OS versions, the failing operation and the expected state. Remote work for USA, UK and Canadian teams starts with a scope and capability review, followed by agreed lab validation and change controls.

<section id="external-resources" class="my-5 py-4 border-top">
  <div class="row align-items-center g-4">
    <div class="col-md-4">
      <h2 class="h4 fw-bold text-dark mb-2">Code Repository & Demonstration</h2>
      <p class="text-muted small mb-0">
        Explore the source code architecture on GitHub or stream the operational demonstration.
      </p>
    </div>
    <div class="col-md-8">
      <div class="d-flex flex-wrap gap-2 justify-content-md-end justify-content-start">
        <a href="https://github.com/Imran5693/network-user_manage-automation.git"
           target="_blank"
           rel="noopener"
           class="btn btn-dark btn-sm px-3 py-2 fw-semibold">
          <i class="fab fa-github me-2"></i> View GitHub Repository
        </a>
        <a href="https://youtu.be/WkILrQ93Le4"
           target="_blank"
           rel="noopener"
           class="btn btn-danger btn-sm px-3 py-2 fw-semibold">
          <i class="fab fa-youtube me-2"></i> Watch Demonstration
        </a>
      </div>
    </div>
  </div>
</section>
