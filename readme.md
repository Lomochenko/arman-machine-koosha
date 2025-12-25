# ARMAN Machine Koosha

**Manufacturer of PVC Extruders and Auxiliary Equipment — Nuxt Frontend**

This repository contains the current frontend application for the ARMAN Machine Koosha corporate website built with **Nuxt 3**.

> **Status:** Frontend in progress. No backend or dynamic data integration yet.

---

## 📌 Features (Current)
- Nuxt 3 frontend SPA/SSR structure
- Modular components and composables
- Multi-language support (locales folder)
- Static content for company and product information
- Deployed to Vercel

---

## 🧱 Project Structure

.
├── assets/
│ └── css/ # Global styling
├── components/ # Vue components
├── composables/ # Reusable logic modules
├── pages/ # Nuxt pages
├── plugins/ # Vue/Nuxt plugins
├── public/ # Static assets (images, fonts, etc.)
├── middleware/ # Route middleware
├── server/ # (Empty — reserved for APIs)
├── nuxt.config.ts # Nuxt configuration
└── package.json

---

## ⚠️ Current Limitations
- **No database**
- **No backend API**
- **No admin dashboard**
- All content is static or client-side only.

---

## 🛠️ Roadmap (Planned)

### 1. Add Django Backend
- Build a separate Django API (Django REST Framework)
- Define models: products, machines, dashboards, users
- Serve data to the frontend via REST or GraphQL

### 2. Real-time Dashboard (Nuxt)
- Create secured admin dashboard in a separate Nuxt app
- Manage data from Django (CRUD interfaces)
- Support live updates and real-time status

### 3. Optimization
- Remove `.nuxt` & build artifacts from the repo (use `.gitignore`)
- Improve responsiveness and performance
- Enable caching and production optimizations

### 4. Deployment
- Deploy backend (e.g., DigitalOcean, Render)
- Deploy frontend with frontend API proxy
- Setup CI/CD pipeline

---

## 🧩 Tech Stack (Future)

| Layer | Technology |
|-------|------------|
| API | Django + Django REST Framework |
| DB | PostgreSQL (Recommended) |
| Frontend | Nuxt 3 (Current) |
| Auth | JWT / OAuth |
| Deployment | Vercel (frontend), Cloud/VM (API) |

---

## 🚀 How to Run (Current Frontend Only)

```bash
git clone https://github.com/Lomochenko/arman-machine-koosha.git
cd arman-machine-koosha
npm install
npm run dev
Note: Backend API is not yet available.

🤝 Contribution
This project is being actively developed. Feel free to open PRs, issues, and discussions!

⭐ License
This project is released under the MIT License. 
GitHub

---

## **Next Step Offer**
If you want, I can also provide:

1. **Django Backend Boilerplate** (models, API views, JWT auth)
2. **Nuxt Dashboard Skeleton** (admin routing, API integration)
3. **CI/CD & Deployment Plan**

Just tell me which one to generate next.
::contentReference[oaicite:4]{index=4}