---
layout: project
title: "Enhanced Interdepartmental Communication System (Campus Area Network)"
description: "Simulated and deployed a secure, scalable campus network integrating interdepartmental communication with centralized management and security."
date: 2024-05-10
thumbnail: {{ site.baseurl }}/assets/images/projects\network topology.jpg
tags: ["Networking", "Campus Network", "OSPF", "VLAN", "Security", "Active Directory"]
---

This project involved designing, simulating, and implementing a **complete campus network infrastructure** to enhance communication and collaboration among different university departments. Using **VMware, GNS3, and Windows Server 2016**, the setup provided centralized management, secure data exchange, and interdepartmental connectivity.

---

### Key Features
- **VLAN Segmentation & Trunking**: Departmental isolation and efficient traffic management.  
- **OSPF Dynamic Routing**: Ensured scalable and resilient routing across multiple routers and Fortinet firewall.  
- **Centralized User Management**: Active Directory for user accounts, OUs, groups, and Group Policies.  
- **DHCP & DNS Services**: Automated IP allocation with DHCP relay and centralized name resolution.  
- **Firewall & Security Policies**: NAT, ACLs, and departmental firewall policies for secure internet access.  
- **High Availability**: STP and VTP domain configuration for redundancy and VLAN propagation.  
- **User Experience**: Windows 10 and Windows 7 clients joined to the domain with applied departmental policies.  
- **Group Policy Automation**: BGInfo implementation for department-based user desktops.  

---

### Tools & Technologies
- **Simulation & Virtualization**: GNS3, VMware Workstation  
- **Servers & Services**: Windows Server 2016 (AD DS, DHCP, DNS)  
- **Network Devices**: Cisco Routers & Switches (OSPF, VLAN, Trunking, STP, VTP)  
- **Security**: Fortinet Firewall (Zone-based firewall, NAT, ACLs, VPN)  
- **Client Systems**: Windows 10 & Windows 7 domain-joined PCs  

---

### Outcome
The deployed system provided:
- Improved **inter-department connectivity** and centralized communication.  
- **Reduced broadcast traffic** through proper VLAN segmentation.  
- **Enhanced security** via ACLs, firewall zoning, and domain policies.  
- **Streamlined IT administration** with centralized Active Directory and Group Policies.  

This setup simulated a **real-world enterprise campus network**, preparing for scalable growth, improved collaboration, and secure communication.


### 📂 Showcase

#### 📄 Reports  
- [Download Final Report (PDF)]({{ site.baseurl }}/assets/files/idmui-final-report.pdf)  
- [System Design Document]({{ site.baseurl }}/assets/files/idmui-design.pdf)  

#### 📑 Slides  
- [Presentation Slides]({{ site.baseurl }}/assets/slides/idmui-presentation.pdf)  

#### 🖼️ Images  
- ![System Architecture]({{ site.baseurl }}/assets/images/\projects\architectural diagram.jpg)  
- ![Use Case Diagram]({{ site.baseurl }}/assets/images/projects\usecase.jpg)  
- ![Dashboard Screenshot]({{ site.baseurl }}/assets/images/projects\MY NETWORK topology.PNG)  
