---
expertise: security
layout: post
title: 'OpenStack Keystone IAM: RBAC, Least Privilege and Access Reviews'
description: Review OpenStack Keystone IAM with RBAC, least privilege and access-review examples. Understand role scope, lifecycle checks and audit evidence.
date: 2025-09-14
author: Imran Sarwar
thumbnail: /assets/images/blog/iam-new-security-perimeter.png
tags:
- Identity and access management
- OpenStack Keystone IAM
- OpenStack Keystone RBAC
- least privilege access review
excerpt: Review OpenStack Keystone IAM with RBAC, least privilege and access-review examples. Understand role scope, lifecycle checks and audit evidence.
modified_date: '2026-10-17T16:00:00+04:00'
search_terms:
- OpenStack Keystone IAM
- OpenStack Keystone RBAC
- least privilege access review
- Keystone role scope
takeaways:
- Authentication does not establish permission for every action.
- Review role assignments with their scope and owner.
- Treat identity, network and application controls as complementary.
article_type: Lab-informed technical guide
topic_label: Identity and access management
related_projects:
- title: 'IDMUI: Flask and OpenStack Keystone integration'
  url: /projects/2025-04-24-idmui-openstack/
- title: Web-based digital certificate management portal
  url: /projects/2025-11-24-digital-certificate-management/
related_posts:
- idmui-project
- zero-trust-architecture
service_url: /network-automation-services/#request-engineering-support
image_alt: 'OpenStack Keystone IAM: RBAC, Least Privilege and Access Reviews — illustrative article cover'
cta_title: Need help with the implementation behind the design?
cta_text: Bring the specific access, certificate, configuration or infrastructure workflow and the result you need. Scope and fit are assessed against the project evidence, rather than assumed to cover a full security audit.
seo_title: 'OpenStack Keystone IAM: RBAC & Least Privilege'
---





Identity and access management (IAM) answers who can perform an action and under what scope. In cloud infrastructure, an overly broad assignment can expose resources even when network connectivity is well controlled.

My OpenStack Keystone and IDMUI work helped me connect users, roles, projects and tokens with day-to-day administrative decisions. This article focuses on reviewing access. It complements the separate Flask application walkthrough rather than repeating its UI architecture.

## Separate identity, permission and scope

Authentication establishes an identity. Authorization evaluates an action against policy. A role name alone is not enough to describe effective access: its scope and the service's configured policy also matter.

For a review, list the principal, assigned role, target scope, business purpose and owner. Ask whether the access is still required and how it will be removed. Shared accounts make that ownership harder to establish.

{% include blog-diagram.html src="/assets/images/diagrams/iam-access-review.svg" alt="Access review cycle: identify a principal, inspect role scope, validate the permission and review its lifecycle" caption="A conceptual IAM review cycle informed by the portfolio lab." %}

## Review administrative access separately

A user who needs a read operation may not need account creation or role assignment rights. A service integration should have the permissions required for its task, not simply reuse an administrator's identity.

Check both successful and denied operations in a test environment. The [Keystone role documentation](https://docs.openstack.org/keystone/latest/admin/service-api-protection.html) describes how default roles interact with scope; verify your deployment's release and policy before applying those expectations.

## Example IAM access-review record

Suppose an integration needs a limited operation in one project. Review the requested permission, assignment scope and actual service policy together. These are illustrative requirements to test; they do not assert what every Keystone role permits by default.

| Review question | Evidence to collect | Follow-up if unclear |
| --- | --- | --- |
| Does the integration need this action? | Named operation, purpose and owner | Clarify the requirement before granting broad access |
| Is the assignment in the intended scope? | Principal, role and project/domain identifiers | Compare the assignment with the target resource |
| Is unrelated access denied? | Result of an approved negative test | Investigate policy and effective permissions |
| Who removes stale access? | Owner, expiry or review action | Assign responsibility for the lifecycle |

The output should support an administrative decision. A list of role names without scope, purpose or ownership cannot establish least privilege.

## Review access across the account lifecycle

Account creation is only the beginning. Record what happens when a person changes responsibilities, a temporary assignment expires or an integration is retired. Review old tokens, credentials and service dependencies under the system's supported lifecycle controls.

A practical review output can be simple: assignment, reason, owner, review date and agreed next action. It should help the administrator resolve exceptions rather than produce a list that nobody owns.

## Keep an audit trail without leaking secrets

Log the actor, target, operation, time and outcome where the implementation supports it. A raw token or password is not useful audit evidence. Decide who can access logs and how an investigation can correlate events across the application and identity service.

A UI should show enough context to prevent an accidental assignment to the wrong project. Server-side validation and service policy must still enforce the decision. My [IDMUI application article]({{ '/2025/08/16/idmui-project.html' | relative_url }}) explains that separation.

## Identity does not replace network security

The phrase identity is the new perimeter is a useful reminder, but it should not imply that routing, segmentation, endpoint controls and application security stop mattering. An attacker can exploit weaknesses across several layers.

For a broader design discussion, read [Zero Trust in enterprise networks]({{ '/2025/10/26/zero-trust-architecture-enterprise-networks.html' | relative_url }}). For a Flask/API project involving identity operations, use the [engineering support inquiry]({{ '/network-automation-services/#request-engineering-support' | relative_url }}) and include the intended actions, scopes and current implementation. This portfolio demonstrates lab and application work, not an independent compliance certification of an IAM deployment.
