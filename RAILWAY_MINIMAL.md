# ✅ MINIMALNE USTAWIENIA - Railway Deployment

## 📦 Pliki w repo (MINIMUM):

```
insignia-agency/
├── railway.json              ← Builder: NIXPACKS
└── backend/
    ├── nixpacks.toml         ← Jak budować
    ├── package.json          ← Dependencies
    ├── package-lock.json     ← Locked versions
    ├── next.config.mjs       ← Next.js config
    └── src/                  ← Kod aplikacji
```

## 🚀 Railway Dashboard - Ustawienia

### 1. Service Settings:

```
Root Directory: backend
```

**TO WSZYSTKO!** Railway automatycznie:
- Wykryje Next.js
- Użyje `nixpacks.toml` z folderu backend
- Zainstaluje Node.js 22 + vips (dla sharp)
- Zbuduje aplikację
- Uruchomi: `next start`

### 2. Environment Variables:

```
DATABASE_URI=mongodb+srv://krukowskiadam_db_user:MX691k9COCFF2cWB@cluster0.xbbwqjz.mongodb.net/insignia?retryWrites=true&w=majority
PAYLOAD_SECRET=f46c7fOwVCNytw0OFVX5eLQRlKuYr3e7jTEj6MJW95k=
PAYLOAD_BLOB_READ_WRITE_TOKEN=vercel_blob_rw_zYD5Bi6fP4NKWvLb_BvSKP0IkAcB9fNFSmxMH46K1RdMz9l
NODE_ENV=production
```

## 🎯 Proces budowania (automatyczny):

```bash
# 1. Setup
nixpacks installs: nodejs_22, vips

# 2. Install  
npm ci

# 3. Build
npm run build

# 4. Start
NODE_OPTIONS='--no-deprecation' next start
```

## 🔍 Troubleshooting:

### "Root directory not set"
→ Railway Dashboard → Settings → Root Directory: `backend`

### "Sharp errors"
→ ✅ Rozwiązane! vips jest w nixpacks.toml

### "Build timeout"
→ ✅ Normalne przy pierwszym buildzie (2-3 min)

### "Cannot connect to database"
→ Sprawdź MongoDB Atlas: IP whitelist `0.0.0.0/0`

## ⚡ Po każdym git push:

Railway automatycznie:
1. Pobierze zmiany z GitHub
2. Zbuduje aplikację (używając cache gdy możliwe)
3. Uruchomi nową wersję
4. Przekieruje ruch na nową wersję (zero downtime)

---

**Nie ma nic więcej do konfiguracji!** 🎉
