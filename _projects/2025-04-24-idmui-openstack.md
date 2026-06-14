---
layout: project
title: "IDMUI - Identity Management User Interface for OpenStack Keystone"
description: "A flagship Python Flask-based IAM platform for OpenStack Keystone, enabling centralized identity management, RBAC control, and API-driven automation."
date: 2025-04-24
thumbnail: "/assets/images/projects/idmui-main.png"
tags:
  - Flask
  - OpenStack Keystone
  - IAM
  - REST API
  - RBAC
  - MySQL
  - Docker
  - Ubuntu Server
keywords:
  - idmui openstack keystone
  - identity management user interface flask
  - openstack identity management system
  - cloud IAM python flask
  - automated role based access control openstack
sitemap: true
priority: 1.0
---

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "IDMUI - Identity Management User Interface",
  "applicationCategory": "SecurityApplication",
  "operatingSystem": "Linux",
  "description": "A production-style Identity Management web application built to simplify OpenStack Keystone administration using a centralized dashboard and REST API automation.",
  "creator": {
    "@type": "Person",
    "name": "Imran Sarwar"
  }
}
</script>

<div class="row align-items-center my-5">
  <div class="col-lg-6">
    <h2 class="fw-bold mb-3">
      Flagship IAM Platform for Cloud Architecture
    </h2>
    <p class="lead text-muted">
      IDMUI is a production-style Identity Management web application built to simplify OpenStack Keystone administration using a centralized dashboard and REST API automation.
    </p>

    <ul class="list-unstyled mt-4 text-secondary">
      <li class="mb-2 d-flex align-items-center">
        <i class="fas fa-check-circle text-primary me-2" style="vertical-align: middle;"></i> <span>Centralized multi-tenant identity governance</span>
      </li>
      <li class="mb-2 d-flex align-items-center">
        <i class="fas fa-check-circle text-primary me-2" style="vertical-align: middle;"></i> <span>Granular Role-Based Access Control (RBAC) enforcement</span>
      </li>
      <li class="mb-2 d-flex align-items-center">
        <i class="fas fa-check-circle text-primary me-2" style="vertical-align: middle;"></i> <span>API-driven resource provisioning & lifecycle automation</span>
      </li>
      <li class="mb-2 d-flex align-items-center">
        <i class="fas fa-check-circle text-primary me-2" style="vertical-align: middle;"></i> <span>Containerized, cloud-ready deployment architecture</span>
      </li>
    </ul>
  </div>

  <div class="col-lg-6 text-center">
    <div class="project-image-wrapper mx-auto my-3" style="max-width: 500px; width: 100%; display: block;">
      <img
        src="{{ site.baseurl }}/assets/images/projects/idmui.png"
        class="img-fluid rounded shadow-lg border"
        alt="IDMUI Authentication Portal Interface"
        style="width: 100%; height: auto; object-fit: contain;">
    </div>
  </div>
</div>

---

<div class="row g-4 my-5">
  <div class="col-md-6">
    <div class="card h-100 p-4 border-0 shadow-sm bg-light">
      <h3 class="h5 fw-bold text-danger mb-3 d-flex align-items-center">
        <i class="fas fa-exclamation-triangle me-2" style="vertical-align: middle;"></i>
        <span>The Operations Challenge</span>
      </h3>
      <p class="text-muted small mb-0">
        Managing OpenStack Keystone strictly through Command Line Interfaces (CLI) and native raw API calls is inherently complex, fragmented, and error-prone. Enterprise operations struggle with manual user provisioning pipelines, a severe lack of centralized administrative visibility, risky multi-step API workflows, and limited native role-based visual access matrices.
      </p>
    </div>
  </div>

  <div class="col-md-6">
    <div class="card h-100 p-4 border-0 shadow-sm bg-light">
      <h3 class="h5 fw-bold text-success mb-3 d-flex align-items-center">
        <i class="fas fa-check-circle me-2" style="vertical-align: middle;"></i>
        <span>The Engineered Solution</span>
      </h3>
      <p class="text-muted small mb-0">
        IDMUI introduces a secure, abstraction web-based management layer natively coupled directly over OpenStack Keystone services. It transforms complex, disjointed CLI/API data streams into a highly intuitive, responsive, and role-enforced administrative web console dashboard for unified cloud credential governance.
      </p>
    </div>
  </div>
</div>

---

<h2 class="text-center fw-bold my-5">
  Core Security Capabilities
</h2>

<div class="row g-4 mb-5">
  <div class="col-md-6 col-lg-4">
    <div class="card h-100 shadow-sm border-0 feature-card p-3">
      <div class="card-body">
        <i class="fas fa-id-card text-primary fs-3 mb-3" style="vertical-align: middle;"></i>
        <h4 class="h6 fw-bold">Centralized Dashboard</h4>
        <p class="text-muted small mb-0">Provides a unified visual workspace to manage tenants, map projects, monitor role bindings, and handle global configurations from a single portal interface.</p>
      </div>
    </div>
  </div>

  <div class="col-md-6 col-lg-4">
    <div class="card h-100 shadow-sm border-0 feature-card p-3">
      <div class="card-body">
        <i class="fas fa-user-shield text-primary fs-3 mb-3" style="vertical-align: middle;"></i>
        <h4 class="h6 fw-bold">RBAC Enforcement</h4>
        <p class="text-muted small mb-0">Implements strict functional boundaries to decouple absolute root cloud Administrators from scoped, low-privilege service customer nodes cleanly.</p>
      </div>
    </div>
  </div>

  <div class="col-md-6 col-lg-4">
    <div class="card h-100 shadow-sm border-0 feature-card p-3">
      <div class="card-body">
        <i class="fas fa-plug text-primary fs-3 mb-3" style="vertical-align: middle;"></i>
        <h4 class="h6 fw-bold">REST API Integration</h4>
        <p class="text-muted small mb-0">Leverages native programmatic backend microservice integrations to execute real-time token, policy, and user tasks against Keystone APIs.</p>
      </div>
    </div>
  </div>

  <div class="col-md-6 col-lg-4">
    <div class="card h-100 shadow-sm border-0 feature-card p-3">
      <div class="card-body">
        <i class="fas fa-heartbeat text-primary fs-3 mb-3" style="vertical-align: middle;"></i>
        <h4 class="h6 fw-bold">Service Monitoring</h4>
        <p class="text-muted small mb-0">Supplies operational telemetry visibility into active cloud endpoint targets, charting identity system runtime statuses and process health metrics.</p>
      </div>
    </div>
  </div>

  <div class="col-md-6 col-lg-4">
    <div class="card h-100 shadow-sm border-0 feature-card p-3">
      <div class="card-body">
        <i class="fas fa-lock text-primary fs-3 mb-3" style="vertical-align: middle;"></i>
        <h4 class="h6 fw-bold">Secure Backend Architecture</h4>
        <p class="text-muted small mb-0">Engineered with robust Python Flask session policies, safe parameters parsing, and secure cryptography configurations to avoid session leakage.</p>
      </div>
    </div>
  </div>

  <div class="col-md-6 col-lg-4">
    <div class="card h-100 shadow-sm border-0 feature-card p-3">
      <div class="card-body">
        <i class="fas fa-database text-primary fs-3 mb-3" style="vertical-align: middle;"></i>
        <h4 class="h6 fw-bold">Database Integration</h4>
        <p class="text-muted small mb-0">Links securely into a persistent relational MySQL layer to process administrative task auditing footprints, security tracking, and configurations.</p>
      </div>
    </div>
  </div>
</div>

---

<h2 class="text-center fw-bold my-5">Technical Design Ecosystem</h2>

<div class="row text-center my-5 g-3">
  <div class="col-md-3">
    <div class="p-3 border rounded bg-white shadow-sm h-100 d-flex flex-column justify-content-center">
      <h3 class="fw-bold text-primary mb-1" style="font-size: 1.4rem;">Python / Flask</h3>
      <p class="small text-muted mb-0">Application Framework Layer</p>
    </div>
  </div>
  <div class="col-md-3">
    <div class="p-3 border rounded bg-white shadow-sm h-100 d-flex flex-column justify-content-center">
      <h3 class="fw-bold text-primary mb-1" style="font-size: 1.4rem;">OpenStack Keystone</h3>
      <p class="small text-muted mb-0">Core Cloud IAM Integration Target</p>
    </div>
  </div>
  <div class="col-md-3">
    <div class="p-3 border rounded bg-white shadow-sm h-100 d-flex flex-column justify-content-center">
      <h3 class="fw-bold text-primary mb-1" style="font-size: 1.4rem;">MySQL</h3>
      <p class="small text-muted mb-0">Relational Database Analytics</p>
    </div>
  </div>
  <div class="col-md-3">
    <div class="p-3 border rounded bg-white shadow-sm h-100 d-flex flex-column justify-content-center">
      <h3 class="fw-bold text-primary mb-1" style="font-size: 1.4rem;">Docker / Ubuntu</h3>
      <p class="small text-muted mb-0">Container Infrastructure Nodes</p>
    </div>
  </div>
</div>

---

<div class="my-5 bg-dark text-white rounded-4 p-5 shadow-sm">
  <div class="row align-items-center">
    <div class="col-lg-8">
      <h3 class="fw-bold text-info mb-3">Systems Solution Engineering Perspective</h3>
      <p class="small mb-0 text-secondary" style="line-height: 1.7;">
        This flagship platform marks a milestone engineering shift from a traditional Network/System administrator configuration path toward an explicit cloud solution architect model. By binding production-grade Python web endpoints with live, complex API infrastructures, the project establishes deep practical deployment validation suitable across <strong>Cloud Engineering, Cybersecurity, DevSecOps, and IAM infrastructure tracks</strong>.
      </p>
    </div>
    <div class="col-lg-4 text-center mt-4 mt-lg-0">
      <div class="p-3 border border-secondary rounded-3">
        <h2 class="display-5 fw-bold text-info mb-0" style="font-size: 1.8rem;">Cloud IAM</h2>
        <p class="text-muted small mb-0 uppercase tracking-wider">Production-Style Abstraction Layer</p>
      </div>
    </div>
  </div>
</div>

---

<h3 class="fw-bold mb-4">Application Interface Showcases</h3>

<div class="row g-4 mb-5 justify-content-center">
  <div class="col-md-6 text-center">
    <div class="card p-3 border-0 shadow-sm bg-white">
      <h4 class="h6 fw-bold mb-3 text-start"><i class="fas fa-sign-in-alt text-primary me-2" style="vertical-align: middle;"></i> Central Authentication Gateway Node</h4>
      <div class="project-image-wrapper mx-auto" style="max-width: 440px; width: 100%; display: block;">
        <img src="{{ site.baseurl }}/assets/images/projects/idmui-login.PNG" class="img-fluid rounded border shadow-sm" alt="IDMUI Central Portal Access UI" style="width: 100%; height: auto; object-fit: contain;">
      </div>
    </div>
  </div>

  <div class="col-md-6 text-center">
    <div class="card p-3 border-0 shadow-sm bg-white">
      <h4 class="h6 fw-bold mb-3 text-start"><i class="fas fa-th text-primary me-2" style="vertical-align: middle;"></i> Administrative Identity Management Console</h4>
      <div class="project-image-wrapper mx-auto" style="max-width: 440px; width: 100%; display: block;">
        <img src="{{ site.baseurl }}/assets/images/projects/dashboard.jpg" class="img-fluid rounded border shadow-sm" alt="IDMUI Management Console Dashboard Overview" style="width: 100%; height: auto; object-fit: contain;">
      </div>
    </div>
  </div>
</div>

---

<section id="external-resources" class="my-5 py-4 border-top">
  <div class="row align-items-center g-4">
    <div class="col-md-4">
      <h4 class="fw-bold text-dark mb-2">
        Project Assets &amp; Verification
      </h4>
      <p class="text-muted small mb-0">
        Inspect the dynamic source code codebase configuration tables or watch the live operational application pipeline walkthrough.
      </p>
    </div>

    <div class="col-md-8">
      <div class="d-flex flex-wrap gap-2 justify-content-md-end justify-content-start">
        <a href="https://github.com/Imran5693/idmui-app.git"
           target="_blank"
           rel="noopener"
           class="btn btn-dark btn-sm px-3 py-2 fw-semibold d-inline-flex align-items-center">
          <i class="fab fa-github me-2" style="vertical-align: middle;"></i>
          <span>View GitHub Repository</span>
        </a>

        <a href="https://www.youtube.com/watch?v=FDpKgDmPDew"
           target="_blank"
           rel="noopener"
           class="btn btn-danger btn-sm px-3 py-2 fw-semibold d-inline-flex align-items-center">
          <i class="fab fa-youtube me-2" style="vertical-align: middle;"></i>
          <span>Watch Live Demonstration</span>
        </a>
      </div>
    </div>
  </div>
</section>