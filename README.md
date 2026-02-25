# AccessGraph 🔐

AccessGraph is a visual cybersecurity tool that demonstrates the impact of poor access control in organizations. It helps users understand how implementing Role-Based Access Control (RBAC) can reduce security risks and limit the damage caused by compromised accounts.

---

## 🚀 Problem
Many organizations give employees excessive access to internal systems. If one account is compromised (for example through phishing), attackers can gain access to sensitive resources such as payroll systems, databases, or cloud infrastructure.

Traditional diagrams do not clearly show the real security impact of these permissions.

---

## 💡 Solution
AccessGraph provides an interactive dashboard that visualizes users, roles, and resources in an organization.

The tool simulates what happens when a user account is compromised and calculates the **“blast radius”** — the number of systems that become vulnerable due to that breach.

By toggling **Role-Based Access Control (RBAC)**, the system instantly demonstrates how restricting permissions reduces risk.

---

## ✨ Features
- Interactive organizational access graph
- Simulate compromised users
- Visual blast radius calculation
- RBAC toggle to compare insecure vs secure access models
- Risk score calculator based on access permissions
- Simple and intuitive UI

---

## 🛠 Tech Stack

Frontend  
- React / Next.js  
- React Flow or Cytoscape.js (graph visualization)  
- Tailwind CSS  

Backend (optional for MVP)  
- Node.js  
- JSON-based data simulation

---

## 📦 Installation & Setup

Follow these steps to run the project locally.

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/AccessGraph.git
```

### 2️⃣ Navigate to Project Folder
```bash
cd AccessGraph
```

### 3️⃣ Install Dependencies
```bash
npm install
```

### 4️⃣ Run Development Server
```bash
npm run dev
```

### 5️⃣ Open in Browser
Open your browser and go to:

```
http://localhost:3000
```

---

## 📊 How It Works
1. Organizational data is loaded from a JSON file.
2. Users and resources are displayed as nodes in a graph.
3. Connections represent access permissions.
4. When a user is compromised, all accessible resources are highlighted.
5. Switching to RBAC restructures the permissions to demonstrate improved security.

---

## 🔬 Cybersecurity Concepts Demonstrated
- Role-Based Access Control (RBAC)
- Principle of Least Privilege
- Access Control Models
- Zero Trust Security Concepts
- Blast Radius Analysis

---

## 🎯 Potential Impact
This tool helps students, developers, and organizations understand how improper access control can lead to major security breaches. It also demonstrates how RBAC and least-privilege strategies significantly reduce organizational risk.

---

## 📚 References
- NIST Access Control Models
- Role-Based Access Control Research
- Zero Trust Architecture Concepts
- Organizational cybersecurity case studies

---

## 📂 Project Status
Hackathon prototype demonstrating cybersecurity access control concepts using interactive visualization.

---

## 📜 License
MIT License
```

---

💡 **Extra hackathon tip:**  
Add **screenshots or a GIF demo** in the README — judges on :contentReference[oaicite:1]{index=1} love seeing a visual preview.

If you want, I can also give you a **super impressive README with badges, architecture diagram, and demo GIF section**.
::contentReference[oaicite:2]{index=2}
