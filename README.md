# INSIGNIA - Marketing Agency Website

Stack: **SvelteKit** + **Strapi** + **Vercel**

## 📁 Struktura projektu

```
INSIGNIA/
├── frontend/          # SvelteKit frontend
└── backend/           # Strapi CMS backend
```

## 🚀 Quick Start

### Frontend (SvelteKit)

```bash
cd frontend
npm install
npm run dev
```

Frontend dostępny na: `http://localhost:5173`

### Backend (Strapi)

```bash
cd backend
npm install
npm run develop
```

Strapi panel dostępny na: `http://localhost:1337/admin`

## 🌐 Deployment

### Frontend na Vercel

1. Push projekt do GitHub
2. Importuj projekt w Vercel
3. Root Directory: `frontend`
4. Framework Preset: SvelteKit
5. Dodaj environment variables:
   - `PUBLIC_STRAPI_URL` - URL do Strapi (produkcyjne)

### Backend (Strapi)

Opcje hostingu dla Strapi:
- **Strapi Cloud** (najłatwiejsze)
- Railway
- Render
- DigitalOcean
- VPS

## 📝 Środowisko

### Frontend `.env`
```
PUBLIC_STRAPI_URL=http://localhost:1337
```

### Backend `.env`
Strapi automatycznie tworzy `.env` podczas instalacji.

## 🛠️ Development

- Frontend: `cd frontend && npm run dev`
- Backend: `cd backend && npm run develop`
- Build frontend: `cd frontend && npm run build`
- Build backend: `cd backend && npm run build`

---
Stworzono: 12 listopada 2025
