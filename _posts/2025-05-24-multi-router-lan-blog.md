---
layout: post
title: "Multi-Router LAN with Wireless Integration and Port Security: Challenges and Solutions"
description: "A detailed blog on Cisco Packet Tracer network simulation demonstrating multi-router LAN, secure wireless integration, port security, and rogue device mitigation. Includes challenges, resolutions, and step-by-step insights."
date: 2025-05-15
author: "Imran Sarwar"
tags:
  - Network Simulation
  - Cisco Packet Tracer
  - Multi-Router LAN
  - Wireless Integration
  - Port Security
  - MAC Filtering
  - Rogue Device Mitigation
  - RIP Routing
  - LAN Segmentation
  - Network Security
  - DevNet
  - Network Automation
keywords:
  - multi-router LAN simulation
  - Cisco Packet Tracer network project
  - port security demonstration
  - wireless integration network
  - rogue device prevention
  - RIP routing protocol
  - LAN segmentation design
  - MAC address filtering
  - secure wireless network
  - network security simulation
canonical: "{{ site.url }}{{ page.url }}"
---

## Introduction

In this blog, we explore the **Multi-Router LAN with Wireless Integration and Port Security Simulation** created in Cisco Packet Tracer.  
The simulation demonstrates **secure multi-router LAN segmentation, wireless access, and rogue device mitigation** while aligning with **OSI and TCP/IP models**.  

This project is particularly relevant for **network engineers, DevNet learners, and cybersecurity enthusiasts**, showing how to **apply practical network security strategies** in a multi-department environment.

---

## Network Topology
![Network Topology]({{ site.baseurl }}/assets/images/projects/multi-router-net-top.PNG)  
*The topology demonstrates 3 routers, 3 switches, multiple PCs, and wireless integration.*

---

## Simulation Overview

### Key Features Implemented
- **RIP Routing**: Dynamic routing between all LAN segments  
- **Wireless Integration**: WPA2-PSK and MAC filtering for legitimate laptops  
- **Port Security**: Enabled on switch access ports, maximum MAC addresses, violation modes  
- **Rogue Device Mitigation**: Unauthorized devices blocked automatically  
- **LAN Segmentation**: Departments logically isolated but interconnected  

### Devices Used
- 3 Routers, 3 Switches, 3 PCs  
- 2 Wireless Routers / Access Points  
- 2 Laptops: Legitimate and Rogue  

---

## Challenges and Resolutions

### 1. Port Security Violations on Wireless Router Uplink
**Challenge:** Wireless router uplink port kept entering violation due to multiple MAC addresses from wireless clients.  
**Resolution:** Increased allowed MAC addresses to 2, set violation mode to restrict. Legitimate devices could connect while rogue devices were blocked.  

### 2. Rogue Laptop Access Denial
**Challenge:** Rogue laptop appeared in MAC address table despite being unauthorized.  
**Resolution:** Verified using `show port-security address` and confirmed ping tests. Rogue device failed connectivity; violation counts increased correctly.  

### 3. Wireless Router Configuration Limitations in Packet Tracer
**Challenge:** Packet Tracer APs don’t support WPA2 or MAC filtering.  
**Resolution:** Replaced with real home wireless router (Linksys WRT300N) configured with WPA2, MAC filtering, and static IPs.  

### 4. Connecting Legitimate Wireless Devices
**Challenge:** Legitimate wireless device failed connectivity initially.  
**Resolution:** Corrected WPA2 password and default gateway. Device communicated successfully with router and LAN.  

---
## Demonstration
- **Video Tutorial**: <a href="https://youtu.be/0MyrHqR190Y" target="_blank" rel="noopener">Watch on YouTube</a>  

- Screenshots for routing tables, MAC tables, and blocked devices:  
  - ![Routing Table]({{ site.baseurl }}/assets/images/projects/multi-router-lan-routing.png)  
  - ![Port Security Violation - Rogue Attempt]({{ site.baseurl }}/assets/images/projects/rogue-attempt-violation-restricted.PNG)  
  - ![Rogue Connection Attempt]({{ site.baseurl }}/assets/images/projects/rogue-connection.PNG)  
  - ![Rogue Laptop Restricted]({{ site.baseurl }}/assets/images/projects/rogue-laptop-restricted.PNG)  

---

## Learning Outcomes
- Applied dynamic routing across multiple LAN segments  
- Implemented secure wireless networks with MAC filtering  
- Mitigated rogue device threats using port security  
- Aligned practical network implementation with OSI/TCP-IP models  

---

## Additional Resources
- **Project GitHub Repository / Packet Tracer File**: [View on GitHub](https://github.com/Imran5693/multi-router-lan-port-security.git)  
- **Project PDF Report**: [Download PDF](https://github.com/Imran5693/multi-router-lan-port-security/blob/main/report/Introduction%20to%20Networks-assign%203.pdf)  