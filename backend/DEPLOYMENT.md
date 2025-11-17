# Deployment Guide - Railway

## 📋 Overview

Backend Payload CMS + Next.js 15 skonfigurowany do deployu na Railway używając Dockera.

## 🚀 Deployment

### Wymagane zmienne środowiskowe w Railway:

```env
DATABASE_URI=mongodb+srv://...
PAYLOAD_SECRET=...
PAYLOAD_BLOB_READ_WRITE_TOKEN=...
NODE_ENV=production
```

### Automatyczny deployment:

Railway automatycznie deployuje po każdym pushu do gałęzi `main`.

```bash
git add .
git commit -m "commit message"
git push
```

## 🐳 Docker Build

### Lokalne testowanie:

```bash
# Build obrazu
docker build -t insignia-backend .

# Uruchomienie
docker run -p 3000:3000 \
  -e DATABASE_URI="..." \
  -e PAYLOAD_SECRET="..." \
  -e PAYLOAD_BLOB_READ_WRITE_TOKEN="..." \
  insignia-backend
```

## 📁 Struktura projektu

```
backend/
├── src/                    # Kod źródłowy
│   ├── app/               # Next.js App Router
│   ├── collections/       # Payload collections
│   └── payload.config.ts  # Konfiguracja Payload
├── public/                # Statyczne pliki
├── Dockerfile             # Multi-stage Docker build
├── .dockerignore          # Ignorowane pliki w Docker
├── railway.json           # Konfiguracja Railway
└── next.config.mjs        # Next.js config (standalone mode)
```

## ⚙️ Konfiguracja

### Dockerfile

- **Base**: Node 22 Alpine Linux
- **Dependencies**: Optymalizowana instalacja z sharp support
- **Builder**: Build z workaround dla sharp w Alpine
- **Runner**: Minimal production image (~200MB)

### railway.json

```json
{
  "build": {
    "builder": "DOCKERFILE"
  },
  "deploy": {
    "startCommand": "node server.js"
  }
}
```

### next.config.mjs

Kluczowa opcja: `output: 'standalone'` - tworzy standalone build dla Dockera.

## 🔧 Rozwiązywanie problemów

### Sharp errors w Alpine Linux

Problem już rozwiązany w Dockerfile przez:
- Instalację `vips-dev` w deps i builder stage
- Reinstalację sharp z flagami: `--cpu=x64 --os=linux --libc=musl`
- Ustawienie `SHARP_IGNORE_GLOBAL_LIBVIPS=1`

### Brak folderu public

Folder `public/` jest teraz trackowany w git (z `.gitkeep`).

### Build fails

1. Sprawdź logi w Railway dashboard
2. Zweryfikuj zmienne środowiskowe
3. Upewnij się, że `package-lock.json` jest w repo

## 📊 Metryki

- **Build time**: ~3-5 min
- **Image size**: ~200MB (compressed)
- **Cold start**: ~2-3s
- **Memory**: 512MB minimum

## 🔄 Aktualizacje

Po zmianie dependencies:

```bash
npm install
git add package.json package-lock.json
git commit -m "update dependencies"
git push
```

## 🎯 Best Practices

1. ✅ Zawsze używaj `npm ci` w produkcji (już w Dockerfile)
2. ✅ Trzymaj `package-lock.json` w repo
3. ✅ Używaj zmiennych środowiskowych dla secrets
4. ✅ Media przechowuj w cloud storage (Vercel Blob)
5. ✅ Monitoruj logi w Railway dashboard
