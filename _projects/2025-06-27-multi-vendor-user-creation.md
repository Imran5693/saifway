---
layout: project
title: "Python Network Automation Project - Multi-Vendor User Management & Configuration Auditing"
description: "A production-focused Python and Netmiko automation framework developed to streamline user lifecycle management, inventory classification, credential updates, and security configuration deployment across heterogeneous enterprise network infrastructures."
date: 2025-06-27
thumbnail: "/assets/images/projects/multi-vendor_project.png"
tags:
  - Python Network Automation
  - Netmiko
  - Multi-Vendor Infrastructure
  - Network Engineering
  - Configuration Management
  - Security Automation
keywords:
  - python network automation
  - netmiko automation project
  - multi vendor network management
  - cisco juniper automation
  - network user management python
  - acl automation
  - hp h3c automation
sitemap: true
priority: 0.9
---

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Multi-Vendor Network Automation Framework",
  "applicationCategory": "NetworkManagementApplication",
  "operatingSystem": "Linux",
  "description": "Python-based automation framework for inventory management, user lifecycle administration, credential updates, and security configuration deployment across multi-vendor enterprise network environments.",
  "creator": {
    "@type": "Person",
    "name": "Imran Sarwar"
  }
}
</script>

### Project Overview

Managing large-scale enterprise networks becomes increasingly complex when infrastructure consists of multiple vendors, operating systems, authentication methods, and command-line interfaces. This project was designed to automate repetitive operational tasks while maintaining reliability, consistency, and security across a diverse network ecosystem.

Using Python and Netmiko, I developed a modular automation framework capable of processing device inventories, identifying device platforms, automating account management operations, deploying security configurations, and handling vendor-specific terminal behaviors that often disrupt standard automation workflows.

The framework was built and tested against a mixed environment containing Cisco, Juniper, Check Point, HP ProCurve, H3C, Brocade, Aruba, F5, and Arista devices.

---

## Business Challenge

Large device inventories often originate from spreadsheets containing inconsistent naming conventions, incomplete records, and mixed vendor platforms. 

Performing tasks such as:
* User creation and deletion
* Credential rotation
* ACL deployment
* Security policy updates
* Configuration verification

across hundreds or thousands of devices manually creates operational risk and consumes significant engineering effort. This project addressed these challenges by creating structured automation workflows capable of safely handling multi-vendor environments.

---

## Automation Architecture

### Inventory Classification & Device Discovery

The first phase focused on transforming raw inventory spreadsheets into structured device groups. Custom parsing modules were developed to process Excel inventories, CSV device exports, and operational asset lists.

Automation scripts included:
* `devices_filter.py`
* `split_by_device_type.py`
* `filter_hp_devices.py`
* `get_devices_config.py`

The output was automatically categorized into vendor-specific execution groups, including:
* Cisco IOS / Nexus / ASA
* Juniper JunOS
* Check Point Firewalls
* HP ProCurve
* H3C
* Brocade
* Aruba
* F5
* Arista

This ensured automation tasks targeted only compatible platforms and reduced operational risk.

---

### Device Validation & Platform Identification

Before executing production changes, device validation scripts were used to verify connectivity and identify platform-specific behavior.

The project included dedicated validation routines capable of:
* Testing SSH accessibility
* Identifying CLI banners
* Verifying privilege levels
* Mapping devices to the correct Netmiko handler
* Detecting unsupported platforms

This validation stage significantly improved execution reliability before any configuration changes were applied.

---

### Solving Netmiko Timing & Terminal Synchronization Challenges

One of the most valuable engineering aspects of this project involved troubleshooting terminal synchronization issues across different vendors. During testing, several platforms-including HP ProCurve, H3C switches, and Juniper devices-exhibited delayed prompt responses, command execution failures, pagination inconsistencies, prompt detection issues, and configuration commit timing problems.

To overcome these challenges, extensive debugging and session analysis were performed. Enhancements included:
* Custom delay-factor tuning
* Prompt-aware execution logic
* Terminal buffer optimization
* Vendor-specific execution timing adjustments
* Commit verification routines
* Execution logging and trace analysis

These improvements dramatically increased automation reliability across non-standard platforms.

---

## User Lifecycle Management Automation

A dedicated collection of scripts was developed to automate account administration across multiple vendors.

Scripts included:
* `cisco-user_deletion.py`
* `juniper_firewall_user_delete.py`
* `check-point_user-deletion.py`

Capabilities included user creation, user deletion, credential updates, account verification, and bulk execution against approved device inventories. This reduced manual CLI administration while ensuring consistency across network infrastructure.

---

## Security & ACL Deployment Automation

The framework also supported automated deployment of security-related configurations.

Scripts included:
* `juniper-update_acl.py`
* `hp_aclconfig.py`

Functions included ACL modifications, security policy updates, rule deployment, configuration validation, and execution logging. Vendor-specific handling was implemented to ensure commands executed correctly according to each platform's operational behavior.

---

## Repository Structure

The project repository was organized into modular execution layers.

### Root Automation Layer
Responsible for inventory processing, data normalization, and device classification.
* `devices_filter.py`
* `split_by_device_type.py`
* `filter_hp_devices.py`
* `get_devices_config.py`

### checking device/
Used for platform identification, device-type validation, SSH testing, and Netmiko compatibility verification.

### tasks/local-devices-remove-list/
Contains vendor-specific operational workflows including Cisco, Juniper, H3C, and Check Point administrative tasks.

### update credentials/
Dedicated to credential updates, ACL deployment, security configuration modifications, and verification logging.

---

## Technologies Used

### Programming
* Python 3

### Automation Libraries
* Netmiko

### Data Processing
* Pandas
* OpenPyXL

### Connectivity
* SSHv2

### Logging & Verification
* Session logging
* Configuration trace analysis
* Manual CLI validation

### Supported Platforms
* Cisco IOS / Cisco Nexus / Cisco ASA
* Juniper JunOS
* Check Point Firewall
* HP ProCurve
* H3C
* Brocade
* Aruba
* F5
* Arista

---

## Engineering Lessons Learned

This project reinforced several important network automation principles:
* Reliable automation begins with accurate inventory management.
* Device identification should always precede configuration execution.
* Multi-vendor environments require platform-aware logic.
* Timing and prompt synchronization issues are common in real-world deployments.
* Logging and verification mechanisms are critical for safe automation.
* Successful network automation requires both software development skills and operational networking expertise.

---

## Project Outcome

The final solution transformed a collection of manual operational tasks into a scalable automation framework capable of supporting multi-vendor enterprise environments.

The project demonstrates practical experience in Python Development, Network Automation, Enterprise Infrastructure Operations, Security Configuration Management, Multi-Vendor Network Engineering, Netmiko Debugging & Optimization, and Operational Process Automation.

By combining network engineering expertise with software-driven automation, the framework significantly improved operational efficiency while reducing configuration risk across large-scale infrastructure environments.

---

<section id="external-resources" class="my-5 py-4 border-top">
  <div class="row align-items-center g-4">
    <div class="col-md-4">
      <h4 class="fw-bold text-dark mb-2">Code Repository & Demonstration</h4>
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