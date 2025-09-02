![React](https://img.shields.io/badge/frontend-React-blue?logo=react)
![Express](https://img.shields.io/badge/backend-Express-green?logo=express)
![Postgres](https://img.shields.io/badge/database-PostgreSQL-blue?logo=postgresql)
![Redis](https://img.shields.io/badge/cache-Redis-red?logo=redis)
![License: AGPLv3](https://img.shields.io/badge/license-AGPLv3-red)

---

<div align="center">

## 🏭 Intelli Factory App

Role-based B2B2C workflow platform
🌐 Check out the live site → [intelli-factory.xyz](https://intelli-factory.xyz)

</div>

---

## 📸 Screenshots

<details>
  <summary><b>📸 View screenshots</b></summary>

![Homepage](https://github.com/user-attachments/assets/7b4298db-2c20-4d5a-9014-83b2e1d3e856)

![Register](https://github.com/user-attachments/assets/e32ba14d-241c-4a33-86ba-a1406bb8bdc4)

## </details>

## ✨ Overview

A role-based B2B2C platform prototype — designed to simulate real manufacturing/logistics workflows while showcasing my full-stack engineering skills.

How it works:

- 👤 Customers → submit requests and see only final compiled offers (factory + logistics), with transparent commissions.
- 🏭 Factories → receive only relevant requests and decide whether to respond, helping increase sales.
- 🚚 Logistics providers → get just the details they need (volume, route, delivery specs) to quote efficiently.
- 🤖 System → automatically compiles factory + logistics into a single best offer for the customer.

✅ Everyone gets exactly what they need — no more, no less.

🌐 Deployed with multilingual support: English, Russian, Chinese.

⚠️ Current stage: homepage + registration flow live; user account features in development.

---

## 🏗 Architecture

    -	client/ → React app (Vite, Zustand, Tailwind).
    -	server/ → Express API (PostgreSQL + Prisma).
    -	workers/ → BullMQ + Redis (async email + background jobs).

---

## ⚙️ Technology Stack

| Layer      | Tools                                    |
| ---------- | ---------------------------------------- |
| Frontend   | React, Vite, Zustand, Tailwind CSS       |
| Backend    | Express, Prisma, PostgreSQL              |
| Auth       | JWT, Email Verification                  |
| Background | BullMQ, Redis (workers for async jobs)   |
| Workflow   | pnpm workspaces (monorepo)               |
| Deployment | Vercel (client), Render (server)         |
| Git & QA   | ESLint, Prettier, Husky, Commitlint, GPG |

---

## 🚀 Local Development

```
pnpm install
pnpm start
```

- 🖥 Server → http://localhost:3001
- 🌐 Client → http://localhost:5173

---

## 🧩 Process Flow

1.  Customer submits a request.
2.  Factories provide offers.
3.  Logistics providers quote delivery.
4.  System compiles the optimal factory + logistics combination.
5.  Customer sees final offer (including commission) and can accept.

Prisma DB models include:

<details>
<summary>Prisma DB Models</summary>

- `user` → accounts (customer, factory, logistic).
- `customer_request`, `factory_offer`, `logistics_request`, `logistic_offer`.
- `compiled_offer` → merged view for customer.
- `final_offer` → locked contract after acceptance.

</details>

---

## 🚦 Git Workflow

- ✅ Prettier + ESLint auto-run on commit.
- ✅ Commitlint enforces Conventional Commits.
- ✅ Signed commits supported.

Example:

```
git commit -m "feat(auth): add email verification flow"
```

---

## 📜 License

[GNU Affero General Public License v3 (AGPLv3)](https://www.gnu.org/licenses/agpl-3.0.html)

- ✅ Share and showcase code freely.
- ✅ Others may learn and contribute.
- ❌ No one can take it private, build a SaaS on top, and profit without open-sourcing their changes.

---

## 🏆 Summary

- ⚙️ Practical role-based workflow system for manufacturing/logistics.
- 💻 Demonstrates frontend, backend, async jobs, deployment, multilingual UI.
- 🚧 Work-in-progress but production-ready structure.
- 🎯 Balanced between a real-world B2B2C solution and a portfolio showcase.

---
