---
layout: project
title: "Machine Learning-Based Cyber Attack Detection in Simulated Enterprise Networks"
description: "A cybersecurity engineering project that combines network simulation, packet analysis, machine learning, and real-time visualization to detect malicious activities such as port scanning, brute-force attempts, and denial-of-service attacks within a simulated enterprise environment."
date: 2026-04-24
thumbnail: "/assets/images/projects/ml-cyber.png"
tags:
  - Cybersecurity
  - Machine Learning
  - Intrusion Detection
  - Network Security
  - Python
  - Flask
  - GNS3
  - Wireshark
  - Threat Detection
  - Security Analytics
keywords:
  - machine learning cyber attack detection
  - network intrusion detection system
  - GNS3 cybersecurity lab
  - packet analysis machine learning
  - Flask security dashboard
  - network traffic classification
  - cybersecurity monitoring project
  - AI cyber security project
sitemap: true
priority: 1.0
---

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Machine Learning-Based Cyber Attack Detection System",
  "applicationCategory": "SecurityApplication",
  "operatingSystem": "Linux",
  "description": "An AI-powered network intrusion detection system built to classify cyber attacks in simulated GNS3 network traffic using Python, Scikit-Learn, and a Flask analytics dashboard.",
  "creator": {
    "@type": "Person",
    "name": "Imran Sarwar"
  }
}
</script>

<div class="row align-items-center my-5">
  <div class="col-lg-6">
    <h2 class="fw-bold mb-3">
      ML-Powered Cyber Attack Detection
    </h2>
    <p class="lead text-muted">
      A practical cybersecurity engineering project designed to simulate real-world attack scenarios, capture network traffic, extract behavioral features, and apply machine learning techniques to identify malicious activities in near real-time.
    </p>

    <ul class="list-unstyled mt-4 text-secondary">
      <li class="mb-2 d-flex align-items-center">
        <i class="fas fa-check-circle text-primary me-2" style="vertical-align: middle;"></i> <span>Enterprise Network Simulation using GNS3</span>
      </li>
      <li class="mb-2 d-flex align-items-center">
        <i class="fas fa-check-circle text-primary me-2" style="vertical-align: middle;"></i> <span>Real Traffic Capture & Packet Analysis via Wireshark/Tshark</span>
      </li>
      <li class="mb-2 d-flex align-items-center">
        <i class="fas fa-check-circle text-primary me-2" style="vertical-align: middle;"></i> <span>Machine Learning-Based Attack Classification</span>
      </li>
      <li class="mb-2 d-flex align-items-center">
        <i class="fas fa-check-circle text-primary me-2" style="vertical-align: middle;"></i> <span>Flask Dashboard for Threat Visualization</span>
      </li>
    </ul>
  </div>

  <div class="col-lg-6 text-center">
    <div class="project-image-wrapper mx-auto my-3" style="max-width: 500px; width: 100%; display: block;">
      <img
        src="{{ site.baseurl }}/assets/images/projects/ml-cyber-attack-detection.png"
        class="img-fluid rounded shadow-lg border"
        alt="Machine Learning Security Dashboard Interface"
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
        <span>The Detection Challenge</span>
      </h3>
      <p class="text-muted small mb-0">
        Traditional security monitoring solutions often depend on static signatures and predefined rules. As cyber threats continue evolving, organizations require more intelligent detection mechanisms capable of identifying abnormal behavior patterns within network traffic. Detecting suspicious activity before it impacts critical systems remains one of the biggest challenges for modern security teams.
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
        I designed a simulated enterprise network environment where both legitimate and malicious traffic could be generated, captured, analyzed, and classified. Using machine learning models and traffic feature extraction techniques, the platform was able to distinguish normal network activity from cyber attacks and present the results through a real-time monitoring dashboard.
      </p>
    </div>
  </div>
</div>

---

<h2 class="text-center fw-bold my-5">
  Simulated Scenarios & Functional Capabilities
</h2>

<div class="row my-5 g-4">
  <div class="col-md-6">
    <h3 class="fw-bold mb-4">Attack Vector Coverage</h3>
    <div class="p-4 border rounded bg-white shadow-sm h-100">
      <ul class="list-unstyled mb-0">
        <li class="mb-3 d-flex align-items-start">
          <i class="fas fa-search text-primary me-2 mt-1" style="vertical-align: middle;"></i>
          <div>
            <strong>Port Scanning:</strong> Simulated reconnaissance attempts used to identify open ports and exposed services.
          </div>
        </li>
        <li class="mb-3 d-flex align-items-start">
          <i class="fas fa-user-lock text-primary me-2 mt-1" style="vertical-align: middle;"></i>
          <div>
            <strong>Brute Force Attacks:</strong> Repeated authentication attempts generated against target infrastructure systems.
          </div>
        </li>
        <li class="mb-3 d-flex align-items-start">
          <i class="fas fa-bolt text-primary me-2 mt-1" style="vertical-align: middle;"></i>
          <div>
            <strong>Denial of Service (DoS):</strong> High-volume traffic patterns generated to simulate network resource exhaustion attacks.
          </div>
        </li>
        <li class="mb-3 d-flex align-items-start">
          <i class="fas fa-user-secret text-primary me-2 mt-1" style="vertical-align: middle;"></i>
          <div>
            <strong>Suspicious Access Attempts:</strong> Unauthorized cross-zone traffic flows introduced to evaluate anomaly detection capability.
          </div>
        </li>
      </ul>
    </div>
  </div>

  <div class="col-md-6">
    <h3 class="fw-bold mb-4">Intelligent Detection Pipeline</h3>
    <div class="p-4 border rounded bg-white shadow-sm h-100 d-flex flex-column justify-content-center align-items-center">
      <div class="text-center font-monospace w-100" style="line-height: 2;">
        <span class="badge bg-primary px-3 py-3 text-wrap w-100 mb-1 fs-6" style="letter-spacing: 0.5px;">Traffic Generation (Legitimate &amp; Kali Linux Vectors)</span><br>
        <div class="text-primary fw-bold my-1"><i class="fas fa-arrow-down fs-4"></i></div>
        <span class="badge bg-secondary px-3 py-3 text-wrap w-100 mb-1 fs-6" style="letter-spacing: 0.5px;">Packet Capture (Live Wire Interfaces via GNS3/Tshark)</span><br>
        <div class="text-primary fw-bold my-1"><i class="fas fa-arrow-down fs-4"></i></div>
        <span class="badge bg-info px-3 py-3 text-wrap w-100 mb-1 fs-6" style="letter-spacing: 0.5px;">Feature Extraction (Flow Profiles &amp; Protocol Metadata)</span><br>
        <div class="text-primary fw-bold my-1"><i class="fas fa-arrow-down fs-4"></i></div>
        <span class="badge bg-warning text-dark px-3 py-3 text-wrap w-100 mb-1 fs-6" style="letter-spacing: 0.5px;">Dataset Serialization (Pandas Matrix &amp; CSV Buffering)</span><br>
        <div class="text-primary fw-bold my-1"><i class="fas fa-arrow-down fs-4"></i></div>
        <span class="badge bg-dark px-3 py-3 text-wrap w-100 mb-1 fs-6" style="letter-spacing: 0.5px;">Machine Learning Analysis (Scikit-Learn Classification Models)</span><br>
        <div class="text-primary fw-bold my-1"><i class="fas fa-arrow-down fs-4"></i></div>
        <span class="badge bg-danger px-3 py-3 text-wrap w-100 fs-6" style="letter-spacing: 0.5px;">Live Threat Visualization (Flask Dashboard Interface)</span>
      </div>
    </div>
  </div>
</div>

---

<h2 class="text-center fw-bold my-5">Technical Design Ecosystem</h2>

<div class="row justify-content-center mb-5">
  <div class="col-lg-8">
    <table class="table table-bordered bg-white shadow-sm align-middle mb-0">
      <tbody>
        <tr>
          <td class="bg-light fw-bold text-start ps-4" style="width: 40%;"><i class="fas fa-project-diagram text-primary me-2" style="vertical-align: middle;"></i> Network Emulator</td>
          <td>GNS3 (Enterprise Lab Virtualization)</td>
        </tr>
        <tr>
          <td class="bg-light fw-bold text-start ps-4"><i class="fas fa-skull text-primary me-2" style="vertical-align: middle;"></i> Attack Platform</td>
          <td>Kali Linux (Malicious Traffic Generation)</td>
        </tr>
        <tr>
          <td class="bg-light fw-bold text-start ps-4"><i class="fas fa-desktop text-primary me-2" style="vertical-align: middle;"></i> Monitoring Platform</td>
          <td>Ubuntu Linux (IDS Node Engine)</td>
        </tr>
        <tr>
          <td class="bg-light fw-bold text-start ps-4"><i class="fas fa-microscope text-primary me-2" style="vertical-align: middle;"></i> Packet Analysis</td>
          <td>Wireshark, Tshark Engine</td>
        </tr>
        <tr>
          <td class="bg-light fw-bold text-start ps-4"><i class="fab fa-python text-primary me-2" style="vertical-align: middle;"></i> Programming Language</td>
          <td>Python 3</td>
        </tr>
        <tr>
          <td class="bg-light fw-bold text-start ps-4"><i class="fas fa-brain text-primary me-2" style="vertical-align: middle;"></i> Machine Learning</td>
          <td>Scikit-Learn (Random Forest, SVM Algorithms)</td>
        </tr>
        <tr>
          <td class="bg-light fw-bold text-start ps-4"><i class="fas fa-chart-bar text-primary me-2" style="vertical-align: middle;"></i> Dashboard Framework</td>
          <td>Flask (Real-Time Web Interface UI)</td>
        </tr>
        <tr>
          <td class="bg-light fw-bold text-start ps-4"><i class="fas fa-th-list text-primary me-2" style="vertical-align: middle;"></i> Data Analysis</td>
          <td>Pandas, NumPy Arrays</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

---

<div class="my-5 bg-dark text-white rounded-4 p-5 shadow-sm">
  <div class="row align-items-center">
    <div class="col-lg-8">
      <h3 class="fw-bold text-info mb-3">
        Security Engineering Perspective
      </h3>
      <p class="small mb-0 text-secondary" style="line-height: 1.7;">
        This project demonstrates the convergence of networking, cybersecurity, machine learning, and software development. Beyond simply identifying attacks, it explores how behavioral analysis and intelligent monitoring can enhance security visibility and support modern SOC, detection engineering, and threat hunting operations.
      </p>
    </div>

    <div class="col-lg-4 text-center mt-4 mt-lg-0">
      <div class="p-3 border border-secondary rounded-3">
        <h2 class="display-5 fw-bold text-info mb-0" style="font-size: 2rem;">
          AI-Powered IDS
        </h2>
        <p class="text-muted small mb-0">
          Intelligent Threat Detection
        </p>
      </div>
    </div>
  </div>
</div>

---

<section id="external-resources" class="my-5 py-4 border-top">
  <div class="row align-items-center g-4">
    <div class="col-md-4">
      <h4 class="fw-bold text-dark mb-2">
        Project Assets &amp; Demonstration
      </h4>
      <p class="text-muted small mb-0">
        Review the project source code, machine learning implementation, and live attack detection demonstrations.
      </p>
    </div>

    <div class="col-md-8">
      <div class="d-flex flex-wrap gap-2 justify-content-md-end justify-content-start">
        <a href="https://github.com/Imran5693/ml-cyber-attack-detection/tree/main"
           target="_blank"
           rel="noopener"
           class="btn btn-dark btn-sm px-3 py-2 fw-semibold d-inline-flex align-items-center">
          <i class="fab fa-github me-2" style="vertical-align: middle;"></i>
          <span>View GitHub Repository</span>
        </a>

        <a href="https://www.youtube.com/playlist?list=PLZCT2yw0ZfllAINykD1iYHVh0qgrnZMfq"
           target="_blank"
           rel="noopener"
           class="btn btn-danger btn-sm px-3 py-2 fw-semibold d-inline-flex align-items-center">
          <i class="fab fa-youtube me-2" style="vertical-align: middle;"></i>
          <span>Watch Demonstration</span>
        </a>
      </div>
    </div>
  </div>
</section>