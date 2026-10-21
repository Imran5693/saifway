---
layout: post
title: 'SMB Access Denied: Troubleshoot Authentication, Share and NTFS Permissions'
seo_title: 'SMB Access Denied: Share and NTFS Permission Checks'
description: Locate SMB access denied at authentication, share connection or file access, then verify a scoped read permission without broadening NTFS or share access.
date: '2026-02-04T09:00:00+04:00'
author: Imran Sarwar
permalink: /blog/smb-access-denied-troubleshooting/
expertise: infrastructure
topic_label: Windows Server infrastructure
article_type: Troubleshooting guide and hypothetical lab
thumbnail: /assets/images/blog/smb-access-denied-troubleshooting-thumbnail.webp
image: /assets/images/blog/smb-access-denied-troubleshooting-thumbnail.webp
thumbnail_width: 1200
thumbnail_height: 630
image_alt: Conceptual file server path with separate identity, share and file permission gates
tags:
- SMB access denied troubleshooting
- Windows Server infrastructure
search_terms:
- SMB access denied troubleshooting
- SMB tree connect denied
- SMB session setup failure
- SMB share versus NTFS permissions
- Get-SmbShareAccess troubleshooting
copy_commands: true
related_posts:
- active-directory-domain-controller-not-contacted-dns
- group-policy-not-applying
- rdp-port-open-cannot-connect
service_url: /remote-network-infrastructure-support/
cta_title: Need help tracing an infrastructure failure?
cta_text: Share sanitized evidence, the platform version and the intended behavior. Imran Sarwar can assess a scoped infrastructure investigation.
published: true
sitemap: true
primary_keyword: SMB access denied troubleshooting
secondary_keywords:
- SMB tree connect denied
- SMB session setup failure
- SMB share versus NTFS permissions
- Get-SmbShareAccess troubleshooting
---

An SMB connection can reach TCP 445 and still fail before a share opens, or open a share and fail on one file. Treat the error as a stage to locate. Changing every permission to Full Control can conceal the cause while exposing unrelated data.

**Scope and evidence:** Proposed Windows 11 Pro client to a Windows Server 2022/2025 member file server using SMB 3 over TCP and Windows PowerShell 5.1. `fs01.example.test` is `192.0.2.60`; share `Reports` maps to `D:\Shares\Reports`. The authorized group is `EXAMPLE\ReportReaders`. These are hypothetical names and paths, not a captured incident. DFS referrals, SMB over QUIC, Azure Files and clustered share scopes require additional endpoint and authorization checks.

<span id="separate-negotiation-session-share-and-file-access"></span>

## Locate SMB Denial at Session Setup, Tree Connect or File Access

The lab assumes that authentication succeeds using the intended domain identity, the group's NTFS Read and Execute permission is already correct, and no applicable deny exists. A missing share-level Read entry stops access. Prove each assumption before using the correction below.

{% include blog-diagram.html src="/assets/images/diagrams/smb-access-denied-troubleshooting-topology.svg" scrollable=true alt="Client reaches fs01 at 192.0.2.60, authenticates, then fails at Reports share permission; adding an approved Read entry leaves NTFS permissions unchanged" caption="Hypothetical before/after. The share ACL is the injected fault; NTFS and identity are separate checkpoints." %}

On the **client, read-only PowerShell**, confirm the destination and current session context:

```powershell
Resolve-DnsName fs01.example.test -Type A
Test-NetConnection fs01.example.test -Port 445
Get-SmbConnection |
    Select-Object ServerName, ShareName, UserName, Dialect, NumOpens
whoami /user
whoami /groups
```

Expect the inventory address and a successful TCP test in this lab. `Get-SmbConnection` reports established connections; an empty result can mean failure occurred before a share connection existed. The local interactive identity is not necessarily the account used by an SMB session. Compare the session's UserName and approved server-side evidence rather than assuming `whoami` proves remote identity. Do not include passwords in commands or tickets.

| Earliest failed checkpoint | Evidence to seek | Next action |
| --- | --- | --- |
| TCP / negotiation | Correct endpoint, connection, supported dialect/security | Inspect transport and client/server compatibility |
| Session setup | Intended authenticated identity or authentication failure | Investigate account, domain, Kerberos and policy |
| Tree connect | Share exists but requested connection is denied | Inspect share ACL and applicable server policy |
| File create/open | Share opens but one object or operation fails | Inspect NTFS effective access, traversal and requested rights |

These are diagnostic boundaries, not a claim that every denial is an ACL problem. Recent OS security defaults can reveal incompatible signing or guest behavior; keep required protections enabled and fix the supported identity/security configuration. Microsoft describes [SMB access-denied causes](https://learn.microsoft.com/en-us/troubleshoot/windows-client/networking/access-denied-access-smb-file-share).

<span id="correlate-one-failed-attempt-with-the-server"></span>

## Compare SMB Session Identity, Share ACL and NTFS Effective Access

Record the exact UNC path, account, operation and timestamp. On an authorized server console, use **read-only elevated PowerShell**:

```powershell
Get-SmbShare -Name Reports | Select-Object Name, Path, ScopeName
Get-SmbShareAccess -Name Reports
Get-SmbSession | Select-Object ClientComputerName, ClientUserName, NumOpens
Get-Acl -LiteralPath 'D:\Shares\Reports' |
    Format-List Owner, AccessToString
```

Expected lab evidence is the intended share path and intended session identity. Compare direct and nested group membership, applicable deny entries, inheritance and the exact file's ACL if only one object fails. Reading an ACL is not a full effective-access calculation: use the Security tab's Advanced Effective Access tool for the actual account and object, then compare the requested operation. A grant at the share cannot compensate for missing filesystem rights; NTFS permission does not by itself grant remote share access.

Inspect the client SMBClient Connectivity/Security channels and relevant server channels around the attempt. Security event records depend on auditing being configured; their absence does not establish success. A bounded, authorized two-sided trace can distinguish a failing SMB2 Session Setup, Tree Connect or Create response when payload visibility permits it. Encryption can prevent inspection of the operation; do not disable it to make a packet capture easier. Traces can expose names and file contents. Microsoft's [SMB troubleshooting primer](https://learn.microsoft.com/en-us/windows-server/storage/file-server/troubleshoot/troubleshooting-smb) explains collection terminology and protocol stages.

{% include blog-diagram.html src="/assets/images/diagrams/smb-access-denied-troubleshooting-flow.svg" scrollable=true alt="SMB decision flow checks intended identity, share permission and filesystem effective access before retesting the exact requested operation" caption="Use the earliest failed stage; do not broaden both ACL layers at once." %}

<span id="correct-only-the-demonstrated-share-omission"></span>

## Add Only the Approved Missing SMB Share Read Permission

**Permission change — hypothetical file server.** The data owner has approved read-only Reports access for `EXAMPLE\ReportReaders`. Confirm the group has no pre-existing allow ACE on this share, no applicable deny applies, and filesystem effective access already permits the required read operation. Save the share ACL and filesystem ACL evidence securely. Check the blast radius: every member of this group receives the share grant, not just the person reporting the error.

On the server, preview and then apply the one approved entry:

```powershell
Grant-SmbShareAccess -Name Reports -AccountName 'EXAMPLE\ReportReaders' -AccessRight Read -WhatIf
Grant-SmbShareAccess -Name Reports -AccountName 'EXAMPLE\ReportReaders' -AccessRight Read -Confirm
```

`-WhatIf` describes the intended action; it does not prove effective access. The confirmed command adds a share allow entry. It does not change NTFS permissions or grant write access. Microsoft documents [Grant-SmbShareAccess](https://learn.microsoft.com/en-us/powershell/module/smbshare/grant-smbshareaccess?view=windowsserver2025-ps). For a clustered/scoped share, determine the correct scope and owner instead of using this standalone example unchanged.

<span id="verify-the-operation-and-retain-narrow-rollback"></span>

## Verify SMB File Access and Restore the Share Permission Baseline

Use the intended account in a fresh, controlled session. Save open work before disconnecting any existing mapping; do not run a blanket `net use * /delete`. Read a designated harmless test file and verify directory listing as required. If write access is intentionally denied, an authorized test against a disposable location should confirm that boundary. Do not test deletion against real data. Correlate the account and attempt with server evidence.

Rollback, **only if the baseline had no allow entry for this trustee**, is:

```powershell
Revoke-SmbShareAccess -Name Reports -AccountName 'EXAMPLE\ReportReaders' -Confirm
```

This removes all share allow ACEs for that trustee, so it is not a safe generic undo if an earlier grant existed. Restore the recorded ACL through the access owner in that case. Existing open handles can retain access until closed; coordinate session handling separately. See the exact [revoke behavior](https://learn.microsoft.com/en-us/powershell/module/smbshare/revoke-smbshareaccess?view=windowsserver2025-ps).

Prevent recurrence with group-based ownership and separate share/NTFS baselines. For domain discovery, follow the [AD DNS checks](/blog/active-directory-domain-controller-not-contacted-dns/); for policy ownership, use [Group Policy processing](/blog/group-policy-not-applying/). The [RDP stages guide](/blog/rdp-port-open-cannot-connect/) applies the same evidence discipline to a different service.
