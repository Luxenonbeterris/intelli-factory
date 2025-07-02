---
# 🏭 Intelli Factory App
---

## 🏗 Architecture

### Monorepo

This project is structured as a **pnpm workspace monorepo** with two main packages:

- **`client/`** — React application powered by Vite.
  Features:

  - Mobile-first UI with Tailwind CSS
  - Zustand for global state management
  - Auth + protected routes
  - Hooks-based business logic separation

- **`server/`** — Express API.
  Features:

  - PostgreSQL + Prisma for robust data modeling
  - Nodemailer for email verification
  - JWT authentication flow with email confirmation
  - Modular route + controller + service structure

### Utilities

- **Logger** under `server/utils/logger.js` with `colors` for pretty terminal output.
- `.env` driven configuration with secure defaults.

### Git & Quality

- **Husky** for enforcing pre-commit & commit-msg hooks
- **Lint-staged** auto-runs Prettier + ESLint
- **Commitlint** to enforce conventional commit style
- **Signed commits** support via GPG / SSH
- **ESLint & Prettier** keep everything clean.

---

## 🔬 Agent-Based Concept

This architecture embraces **agent modules** on the backend, each handling a clear responsibility:

- 📝 **OrderAgent**
  Handles the flow from customer request → factory offer → manager approval → logistics coordination.

- 🚛 **LogisticsAgent**
  Manages logistics request creation and processing of delivery offers.

- 🔐 **AuthAgent**
  Encapsulates registration, email verification, JWT issuance and guards.

- 📣 **NotificationAgent**
  Centralizes all notifications: email confirmations, order updates.

Each can evolve into microservices or be retained as modules under `server/`.

---

## ⚙ Technology Stack

| Layer      | Tech / Tools                            |
| ---------- | --------------------------------------- |
| Frontend   | React, Vite, Zustand, Tailwind CSS      |
| Backend    | Express, Prisma, PostgreSQL, Nodemailer |
| Auth       | JWT, Email Verification (codes)         |
| Quality    | ESLint, Prettier, Husky, Commitlint     |
| Workflow   | pnpm workspaces (monorepo)              |
| Deployment | Vercel (client), Render/Fly.io (server) |
| Git        | GitHub + SSH + signed commits           |

---

## 🚀 Local Development Workflow

### Install everything

```bash
pnpm install
```

### Run backend & frontend in parallel

```bash
pnpm start
```

This starts:

- 🖥 **Server** on [http://localhost:5000](http://localhost:5000)
- 🌐 **Client** on [http://localhost:5173](http://localhost:5173)

---

## 🧩 Detailed Flow

### Roles & Flow

- **Customer** submits request
- **Factory** responds with offers
- **Manager** confirms best offer → triggers logistics
- **Logistics** calculates delivery, provides quote
- **Customer** sees compiled offer (factory + logistics) and accepts.

### Database via Prisma

| Entity            | Purpose                                                        |
| ----------------- | -------------------------------------------------------------- |
| user              | All accounts (customer, factory, logistic, manager) with roles |
| verification_code | Email confirmation workflow                                    |
| position_category | Categories (metals, plastics) for filtering requests           |
| customer_request  | Submitted orders from customers                                |
| factory_offer     | Price + specs from factories                                   |
| logistics_request | Auto-created after manager selects factory offer               |
| logistic_offer    | Delivery offer (price, ETA) from logistics providers           |
| compiled_offer    | Combines factory + logistics for final customer review         |
| final_offer       | Accepted deal, locks the contract                              |

---

## ✍ Available Commands

| Command        | What it does                                 |
| -------------- | -------------------------------------------- |
| `pnpm start`   | Starts server & client in parallel           |
| `pnpm lint`    | Runs ESLint across server & client           |
| `pnpm format`  | Prettifies all supported files with Prettier |
| `pnpm prepare` | Installs Husky git hooks                     |
| `pnpm build`   | Placeholder for custom client/server builds  |

---

## 🚦 Git Workflow & Hooks

### ✅ What happens on commit?

- On **`pre-commit`**, runs:

  - Prettier format
  - ESLint fix
  - `eslint --max-warnings=0` (blocks on any remaining warnings)

- On **`commit-msg`**, uses Commitlint to enforce Conventional Commit style.

```bash
git commit -m "feat(auth): add email verification flow"
```

All enforced by Husky hooks. Commits can be signed (`git commit -S -m "...`).

---

## 🔐 Auth & Prisma Setup

- `.env` stores DB URL, JWT secrets, mail credentials.
- Setup DB & Prisma:

```bash
cd server
npx prisma migrate dev
```

---

## 🚚 Deployment Ready

- Client can deploy straight to **Vercel**.
- Server easily set up on **Render**, **Fly.io**, or any Node-supporting VPS.

---

## 🔭 Future Roadmap

- Add Redis caching for fast logistics + order lookups
- Move NotificationAgent to websocket or MQTT for live updates
- Dockerize full stack with `docker-compose`
- Set up CI/CD on GitHub Actions (lint, test, deploy).

---

## 📜 License

[MIT License](./LICENSE)

---

## 🤝 Contributing

- Fork → create branch `feat/my-feature` → open PR.
- Use clear commit messages like `fix(ui): align dashboard cards`.

---

## 🏆 Summary

This system is engineered for **real B2B operations**,
managing complex request → quote → confirm → delivery chains.
It’s a rock-solid base for smart manufacturing, logistics management, or multi-role platforms —
scalable, modern, and clean.
