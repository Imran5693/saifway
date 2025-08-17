---
layout: post
title: "Designing a Hybrid Network Architecture for Outsourced Data Centre Backup"
description: "A research-driven study on implementing a secure, high-availability hybrid network for outsourced backup operations, integrating on-premises and cloud data centers with QoS, ACLs, OSPF, and VPN GRE."
date: 2024-05-20
author: "Imran Sarwar"
tags: ["Networking", "Hybrid Architecture", "Data Center", "Cloud Integration", "Research", "OSPF", "VPN", "QoS"]
thumbnail: "/assets/images/projects/net-topology.jpg"
---

## Introduction
The rapid growth of **data-driven enterprises** has placed immense pressure on IT infrastructures to provide **scalability, resilience, and security**. Organizations increasingly adopt **hybrid network architectures** that blend **on-premises infrastructure** with **cloud resources** to support **business continuity** and **disaster recovery**.  

This study presents the design and implementation of a **Hybrid Data Centre Network** tailored for **outsourced backup operations**. The project integrates **on-premises servers**, **remote sites**, and a **cloud-based backup infrastructure**, ensuring **low latency, secure communication, and high availability**.

---

## Research and Planning
A systematic research methodology was adopted prior to deployment, focusing on:

- **Hybrid Network Models** — Analysis of on-premises and cloud integration strategies, including cost, performance, and operational trade-offs.  
- **Backup and Disaster Recovery (BDR) Practices** — Review of redundancy models, data protection mechanisms, and compliance requirements.  
- **Routing and Protocols** — Evaluation of **OSPF** for dynamic routing and **VPN GRE tunnels** for secure interconnectivity.  
- **Security Mechanisms** — Study of Access Control Lists (ACLs), encryption standards, and network segmentation.  
- **Traffic Engineering** — Investigation of **QoS mechanisms** to ensure critical workloads remain unaffected by backup processes.  

### Key Considerations
1. Guaranteeing **data integrity** across all locations.  
2. Achieving **low-latency, high-availability connectivity** for mission-critical backups.  
3. Maintaining **security compliance** with enterprise and regulatory standards.  
4. Ensuring **future scalability** for expansion and cloud growth.  

---

## Implementation
The proposed network design included:

- **On-Premises Data Centre**
  - Core Server  
  - Monitoring Server  
  - Backup Server  
  - Storage Area Network (SAN) devices  

- **Two Remote Sites**
  - Interconnected via serial links  
  - High availability configured between redundant paths  

- **Cloud Data Centre**
  - Connected using **VPN GRE tunnels** with encryption and authentication  

- **Dynamic Routing**
  - **OSPF** deployed for automated route exchange and optimized path selection  

- **Security**
  - ACLs configured at boundary routers to enforce least-privilege access  

- **Traffic Optimization**
  - **QoS policies** applied to prioritize backup traffic while protecting production services  

**Tools Utilized:**  
- Cisco Packet Tracer (latest version) for network simulation  
- Microsoft Visio for professional network topology design  

---

## Challenges and Solutions
- **Challenge 1: Balancing Backup vs. Production Traffic**  
  *Solution:* Applied QoS with strict traffic classes, protecting VoIP and real-time applications.  

- **Challenge 2: Securing Cloud Connectivity**  
  *Solution:* Configured VPN GRE tunnels with strong encryption and authentication for end-to-end data security.  

- **Challenge 3: OSPF Instability in Dual Remote Sites**  
  *Solution:* Implemented route summarization and optimized OSPF hello/dead timers to minimize route flapping.  

---

## Testing and Validation
The design was validated through rigorous testing:  

- **Connectivity Tests:** End-to-end ping and traceroute verification.  
- **Redundancy Checks:** Simulated link/node failures to confirm high availability.  
- **Security Validation:** ACL and VPN tunnel enforcement testing.  
- **Performance Evaluation:** QoS monitoring under simulated peak backup load.  

---

## Results
The final hybrid network achieved:  

- **100% uptime** in simulated failover tests  
- **Secure encrypted data transfer** between all nodes and the cloud  
- **Optimized traffic flows**, ensuring backup operations did not affect production services  
- **Future-ready scalability**, with modular expansion for new sites or cloud providers  

---

## Lessons Learned
- **Security-first design** is crucial; retrofitting ACLs and encryption later proved inefficient.  
- **QoS policies are non-negotiable** in hybrid networks where backup traffic coexists with real-time applications.  
- **Comprehensive documentation** of topology and policies significantly reduces troubleshooting and accelerates scaling.  

---

## Conclusion
This research-based implementation highlights the significance of **planning, security engineering, and traffic optimization** in hybrid networks. The proposed architecture effectively combines **on-premises infrastructure with cloud resources**, delivering a **robust, secure, and scalable platform** for outsourced backup operations.  

**Download Detailed Configuration:** [Hybrid Data Centre Config PDF]({{ site.baseurl }}/assets/images/pf.png)  

## Network Topology

<img src="{{ site.baseurl }}/assets/images/projects/NET-top.png" alt="Hybrid Network Topology" class="post-image">
