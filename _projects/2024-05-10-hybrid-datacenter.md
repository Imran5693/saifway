---
layout: project
title: "Hybrid Data Center Network Design – Backup Architecture Case Study"

description: >
  A hands-on hybrid data center network design project focused on secure
  backup architecture, implementing OSPF routing, VPN GRE tunnels,
  QoS traffic prioritization, and ACL-based security controls.

date: 2024-05-10
thumbnail: /assets/images/projects/net-topology.jpg

tags:
  - hybrid network design project
  - network architecture case study
  - VPN GRE OSPF lab
  - secure backup network
  - Cisco networking lab
  - network engineer portfolio

keywords:
  - hybrid data center network design project
  - hybrid backup network architecture
  - VPN GRE OSPF implementation
  - hands-on network architecture lab
  - network engineer portfolio project

sitemap: true
priority: 0.9
---

## Project Overview
This project focuses on the **design and implementation of a hybrid network architecture** to support outsourced data center backup operations. The network ensures **secure communication**, **high availability**, and **optimized performance** through QoS and segmentation policies.

The proposed design integrates:
- **Backup Server** – Deployed within the organization's on-premises data center to manage backup operations.
- **Storage Devices** – Network Attached Storage (NAS) or SAN-based storage systems for local backup storage.
- **Network Infrastructure** – High-bandwidth, segmented network with QoS for prioritizing backup traffic.

## Project Scope
The network is designed to guarantee the **security, integrity, and reliability** of communication between:
- **On-Premises Data Center** (Core Server, Monitoring Server, Backup Server)
- **Two Remote Sites** – Connected via serial links with high availability enabled between them.
- **Cloud Data Center** – Integrated using secure **VPN GRE tunnels**.
- **OSPF Routing** – For dynamic, efficient path selection.
- **ACL Security** – To filter and protect network traffic.
- **QoS** – To optimize bandwidth usage and prioritize critical backup traffic.

## Objectives
- Develop a **comprehensive hybrid architecture** aligned with organizational security requirements.
- Clearly define the number and roles of routers and switches in the design.
- Assess the **existing network infrastructure** for compatibility and connectivity.
- Identify **vulnerabilities** and potential security weaknesses.
- Enable **real-time monitoring and logging** for proactive threat detection.
- Provide **comprehensive documentation** and training for IT staff.

## Requirements Delivered
- **Topology Diagram** (Visio-based, professional format)
- **Test Cases** ensuring reliable communication
- **Configuration Commands** for:
  - OSPF Routing
  - VPN GRE setup
  - ACLs for access control
  - QoS for traffic optimization
- Security gap analysis and integration with existing infrastructure

## Tools & Technologies
- **Cisco Packet Tracer** (Latest Version)
- **Microsoft Visio** (Topology Design)
- Networking protocols: **OSPF, VPN GRE**
- Security controls: **ACLs, QoS**

## Outcome
The implemented hybrid network provides:
- **Reliable inter-site connectivity** with high availability
- **Secure cloud integration** for outsourced backup services
- **Optimized traffic flow** for backup operations
- **Real-time monitoring capability**
- A **scalable and secure foundation** for future expansions

**Topology:**
![Hybrid Network Topology]({{ site.baseurl }}/assets/images/projects/NET-top.png)

**Presentation:**
<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;">
  <iframe src="https://docs.google.com/presentation/d/1dg-FAPuJUjT2bcoQSTLtvm4nZ2kDWOkIAlKtbpM0Xo4/edit?usp=sharing" 
  style="position:absolute;top:0;left:0;width:100%;height:100%;" frameborder="0" allowfullscreen></iframe>
</div>

## Related Articles
- [Designing a Hybrid Data Center Network – Blog](/2024/05/20/hybrid-data-center.html)
- [Campus Area Network Design Project](/projects/2024-12-10-campus-area-network/)
