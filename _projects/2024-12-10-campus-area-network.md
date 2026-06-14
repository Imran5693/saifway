---
layout: project
title: "Campus Network Design Lab - Secure VLAN & Active Directory Based Infrastructure"
description: "A hands-on campus network design lab implementing VLAN segmentation, OSPF routing, Active Directory, DHCP/DNS services, and firewall-based security for secure interdepartmental communication."
date: 2024-12-10
thumbnail: "/assets/images/projects/network-topology.jpg"
tags:
  - VLAN
  - OSPF
  - Active Directory
  - DHCP
  - DNS
  - Fortinet Firewall
  - VMware
  - GNS3
keywords:
  - campus network design lab
  - VLAN segmentation project
  - Active Directory network lab
  - OSPF routing implementation
  - Fortinet firewall configuration lab
  - network engineer portfolio project
sitemap: true
priority: 0.9
---

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Campus Network Design & Directory Services Lab",
  "applicationCategory": "NetworkInfrastructureDesign",
  "operatingSystem": "Cisco IOS, Windows Server, FortiOS",
  "description": "An enterprise-grade virtual campus network simulation integrating layered switches, OSPF path optimization, Active Directory DS domains, and a Fortinet edge firewall.",
  "creator": {
    "@type": "Person",
    "name": "Imran Sarwar"
  }
}
</script>

<div class="row align-items-center my-5">
  <div class="col-lg-6">
    <h2 class="fw-bold mb-3">
      Enterprise Campus Network Architecture
    </h2>
    <p class="lead text-muted">
      A comprehensive, multi-layered network design lab simulating a secure corporate environment. This project integrates structural subnetting, dynamic backbone routing, centralized domain directory policies, and edge perimeter defenses.
    </p>

    <ul class="list-unstyled mt-4 text-secondary">
      <li class="mb-2 d-flex align-items-center">
        <i class="fas fa-check-circle text-primary me-2" style="vertical-align: middle;"></i> <span>Layer-2 Isolation via Departmental VLAN Segmentation</span>
      </li>
      <li class="mb-2 d-flex align-items-center">
        <i class="fas fa-check-circle text-primary me-2" style="vertical-align: middle;"></i> <span>Multi-Area OSPF Dynamic Routing Layer Core</span>
      </li>
      <li class="mb-2 d-flex align-items-center">
        <i class="fas fa-check-circle text-primary me-2" style="vertical-align: middle;"></i> <span>Centralized Windows Domain Access via Active Directory</span>
      </li>
      <li class="mb-2 d-flex align-items-center">
        <i class="fas fa-check-circle text-primary me-2" style="vertical-align: middle;"></i> <span>Zone-Based Perimeter Control via Fortinet Firewall</span>
      </li>
    </ul>
  </div>

  <div class="col-lg-6 text-center">
    <div class="project-image-wrapper mx-auto my-3" style="max-width: 500px; width: 100%; display: block;">
      <img
        src="{{ site.baseurl }}/assets/images/projects/network-topology.jpg"
        class="img-fluid rounded shadow-lg border"
        alt="Campus Network Topology Thumbnail"
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
        <span>The Enterprise Challenge</span>
      </h3>
      <p class="text-muted small mb-0">
        Multi-department organizations running unsegmented network architectures face immediate structural vulnerabilities. Flat networks suffer from extensive broadcast domain pollution, lack traffic prioritization controls, allow unmonitored cross-department lateral movement, and isolate identity verification, complicating centralized client auditing and access controls.
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
        I engineered a secure, multi-tier virtualized campus network. By applying strict VLAN separations at the access switch layer, establishing dynamic OSPF pathways, deploying centralized Windows Active Directory servers (AD DS, DHCP, DNS), and implementing strict zone policies via a virtual Fortinet Firewall appliance, threat surfaces are minimized across all zones.
      </p>
    </div>
  </div>
</div>

---

<h2 class="text-center fw-bold my-5">
  Core Engineering Implementations
</h2>

<div class="row g-4 mb-5">
  <div class="col-md-6 col-lg-3">
    <div class="card h-100 shadow-sm border-0 feature-card p-3">
      <div class="card-body">
        <i class="fas fa-sitemap text-primary fs-3 mb-3" style="vertical-align: middle;"></i>
        <h4 class="h6 fw-bold">VLAN Segmentation</h4>
        <p class="text-muted small mb-0">
          Deploys isolated broadcast domains across dedicated departmental switchports linked with 802.1Q trunking to optimize path boundaries.
        </p>
      </div>
    </div>
  </div>

  <div class="col-md-6 col-lg-3">
    <div class="card h-100 shadow-sm border-0 feature-card p-3">
      <div class="card-body">
        <i class="fas fa-route text-primary fs-3 mb-3" style="vertical-align: middle;"></i>
        <h4 class="h6 fw-bold">OSPF Routing Layer</h4>
        <p class="text-muted small mb-0">
          Implements Open Shortest Path First protocols to manage dynamic link availability paths, complete with DHCP relay configurations.
        </p>
      </div>
    </div>
  </div>

  <div class="col-md-6 col-lg-3">
    <div class="card h-100 shadow-sm border-0 feature-card p-3">
      <div class="card-body">
        <i class="fas fa-users-cog text-primary fs-3 mb-3" style="vertical-align: middle;"></i>
        <h4 class="h6 fw-bold">Active Directory Matrix</h4>
        <p class="text-muted small mb-0">
          Establishes centralized object governance, automates IP parameters via DHCP scopes, handles DNS lookup trees, and pushes strict Group Policies.
        </p>
      </div>
    </div>
  </div>

  <div class="col-md-6 col-lg-3">
    <div class="card h-100 shadow-sm border-0 feature-card p-3">
      <div class="card-body">
        <i class="fas fa-user-shield text-primary fs-3 mb-3" style="vertical-align: middle;"></i>
        <h4 class="h6 fw-bold">Fortinet Perimeter Rules</h4>
        <p class="text-muted small mb-0">
          Configures next-generation firewall interfaces to enforce zone policies, parse inter-VLAN access lists, and implement NAT translation rules.
        </p>
      </div>
    </div>
  </div>
</div>

---

<h2 class="text-center fw-bold my-5">Technical Ecosystem Mapping</h2>

<div class="row justify-content-center mb-5">
  <div class="col-lg-8">
    <table class="table table-bordered bg-white shadow-sm align-middle mb-0">
      <tbody>
        <tr>
          <td class="bg-light fw-bold text-start ps-4" style="width: 40%;"><i class="fas fa-layer-group text-primary me-2" style="vertical-align: middle;"></i> Simulation Platforms</td>
          <td>GNS3 Engine, VMware Workstation Pro Environment</td>
        </tr>
        <tr>
          <td class="bg-light fw-bold text-start ps-4"><i class="fas fa-server text-primary me-2" style="vertical-align: middle;"></i> Identity &amp; System Node</td>
          <td>Windows Server 2016 Core (AD DS, DNS Infrastructure, DHCP Scopes)</td>
        </tr>
        <tr>
          <td class="bg-light fw-bold text-start ps-4"><i class="fas fa-network-wired text-primary me-2" style="vertical-align: middle;"></i> Network Switching Core</td>
          <td>Cisco IOS Virtual Multilayer Routers &amp; Access Switches</td>
        </tr>
        <tr>
          <td class="bg-light fw-bold text-start ps-4"><i class="fas fa-shield-alt text-primary me-2" style="vertical-align: middle;"></i> Firewall Appliance</td>
          <td>Fortinet FortiGate Virtual Firewall (FortiOS Zone-Policies)</td>
        </tr>
        <tr>
          <td class="bg-light fw-bold text-start ps-4"><i class="fas fa-project-diagram text-primary me-2" style="vertical-align: middle;"></i> Configured Protocols</td>
          <td>OSPF Dynamic Routing, 802.1Q Trunking, DHCP Relay, NAT Maps, GPO Lists</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

---

<div class="my-5 bg-dark text-white rounded-4 p-5 shadow-sm">
  <div class="row align-items-center">
    <div class="col-lg-8">
      <h3 class="fw-bold text-info mb-3">Enterprise Engineering Perspective</h3>
      <p class="small mb-0 text-secondary" style="line-height: 1.7;">
        This lab architecture models a blueprint for production corporate networks. Successfully chaining low-level layer-2 loop mitigations with high-level server group directory architectures and zone-separated defensive edges demonstrates structural readiness across <strong>Network Engineering, Systems Administration, and Infrastructure Security tracks</strong>.
      </p>
    </div>

    <div class="col-lg-4 text-center mt-4 mt-lg-0">
      <div class="p-3 border border-secondary rounded-3">
        <h2 class="display-5 fw-bold text-info mb-0" style="font-size: 1.8rem;">
          Secure Core
        </h2>
        <p class="text-muted small mb-0">
          Hybrid Enterprise Topology
        </p>
      </div>
    </div>
  </div>
</div>

---

<h3 class="fw-bold mb-4">Topology Blueprints &amp; Lab Architecture Viewports</h3>
<p class="text-muted small mb-4">
  Review the complete enterprise network maps and use-case layouts. These visuals are expanded to edge-to-edge structural view containers for full-frame clarity.
</p>

<div class="row g-4 mb-5 justify-content-center">
  <div class="col-12 text-center my-3">
    <div class="card p-3 border-0 shadow-sm bg-white mx-auto" style="max-width: 900px; width: 100%;">
      <h4 class="h6 fw-bold mb-3 text-start"><i class="fas fa-project-diagram text-primary me-2" style="vertical-align: middle;"></i> Comprehensive Lab Infrastructure Topology Map</h4>
      <div class="project-image-wrapper mx-auto w-100" style="display: block;">
        <img src="{{ site.baseurl }}/assets/images/projects/MY NETWORK topology.PNG" class="img-fluid rounded border shadow-sm w-100" alt="Full Framework Campus Topology Design Layout" style="height: auto; object-fit: contain;">
      </div>
    </div>
  </div>

 

  <div class="col-12 text-center my-3">
    <div class="card p-3 border-0 shadow-sm bg-white mx-auto" style="max-width: 900px; width: 100%;">
      <h4 class="h6 fw-bold mb-3 text-start"><i class="fas fa-shield-alt text-primary me-2" style="vertical-align: middle;"></i> The use case diagram demonstrates how users, administrators, network services, and infrastructure components interact within the environment.</h4>
      <div class="project-image-wrapper mx-auto w-100" style="display: block;">
        <img src="{{ site.baseurl }}/assets/images/projects/usecase.jpg" class="img-fluid rounded border shadow-sm w-100" alt="Subnet Zone Policy Mapping Verifications" style="height: auto; object-fit: contain;">
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
        Access the localized configuration settings repository, clone the laboratory topology data, or audit operational deployment checklists.
      </p>
    </div>

    <div class="col-md-8">
      <div class="d-flex flex-wrap gap-2 justify-content-md-end justify-content-start">
        <a href="https://github.com/Imran5693/campus-network-design-lab"
           target="_blank"
           rel="noopener"
           class="btn btn-dark btn-sm px-3 py-2 fw-semibold d-inline-flex align-items-center">
          <i class="fab fa-github me-2" style="vertical-align: middle;"></i>
          <span>View GitHub Repository</span>
        </a>
      </div>
    </div>
  </div>
</section>