# Deploy Backend na Railway - UPROSZCZONA WERSJA

## 🎯 Strategia: Nixpacks (NIE Docker!)

Railway ma natywne wsparcie dla Next.js przez Nixpacks - prostsze i szybsze niż Docker.

## Kroki deployment:

### 1. Przygotowanie
- [x] Backend czysty i działający lokalnie
- [x] `nixpacks.toml` w folderze backend (minimalna konfiguracja)
- [x] `railway.json` w głównym katalogu

### 2. Deployment na Railway

1. **Idź na Railway.app:**
   - Otwórz: https://railway.app
   - Zaloguj się przez GitHub

2. **Utwórz nowy projekt:**
   - Kliknij "New Project"
   - Wybierz "Deploy from GitHub repo"
   - Wybierz: `KrukowskiAdam/insignia-agency`

3. **⚠️ WAŻNE - Ustawienia Service:**
   
   W Railway Dashboard → Settings → Service:
   
   ```
   Root Directory: backend
   ```
   
   To wszystko! Railway automatycznie:
   - Wykryje Next.js
   - Użyje nixpacks.toml
   - Zainstaluje vips dla sharp
   - Zbuduje i uruchomi aplikację

4. **Dodaj Environment Variables:**
   
   W Railway Dashboard → Variables:
   
   ```
   DATABASE_URI=mongodb+srv://krukowskiadam_db_user:MX691k9COCFF2cWB@cluster0.xbbwqjz.mongodb.net/insignia?retryWrites=true&w=majority
   PAYLOAD_SECRET=f46c7fOwVCNytw0OFVX5eLQRlKuYr3e7jTEj6MJW95k=
   PAYLOAD_BLOB_READ_WRITE_TOKEN=vercel_blob_rw_zYD5Bi6fP4NKWvLb_BvSKP0IkAcB9fNFSmxMH46K1RdMz9l
   NODE_ENV=production
   ```

5. **Deploy:**
   - Railway automatycznie zbuduje przy każdym pushu
   - Otrzymasz URL: `your-app.up.railway.app`

### 3. Po deployment

1. **Sprawdź URL:**
   - Odwiedź: `https://your-app.up.railway.app/admin`
   - Zaloguj się: `krukowski.adam@gmail.com`

2. **Zaktualizuj frontend `.env`:**
   ```
   PUBLIC_PAYLOAD_URL=https://your-app.up.railway.app
   ```

3. **Zredeploy frontend na Vercel:**
   - Push do GitHub
   - Vercel automatycznie zredeploy

## 🚀 Dlaczego Nixpacks > Docker?

### Docker (stara metoda):
❌ Długi build (3-5 min)
❌ Duży obraz (~200MB)  
❌ Dużo zależności (vips-dev, build-base, python3, g++, make)
❌ Komplikacje z sharp w Alpine Linux
❌ Trudniejszy debugging

### Nixpacks (nowa metoda):
✅ **Szybki build** (~2 min)
✅ **Mniejszy rozmiar** (~150MB)
✅ **Minimalne zależności** (tylko vips)
✅ **Natywne wsparcie** dla Next.js + sharp
✅ **Łatwiejszy debug** - przejrzyste logi
✅ **Lepsze cache'owanie** - Railway optymalizuje

## 📁 Struktura plików:

```
insignia-agency/
├── railway.json              ← minimalna konfiguracja
└── backend/
    ├── nixpacks.toml         ← buildowanie
    ├── package.json
    ├── next.config.mjs       ← bez 'standalone'
    └── src/
```

## Troubleshooting

### Build fails: "Cannot find module"
✅ Sprawdź czy **Root Directory = `backend`** w Railway Settings

### Build fails: Sharp errors  
✅ **Rozwiązane!** nixpacks.toml ma `vips` w nixPkgs

### Inne problemy:
1. Zweryfikuj zmienne środowiskowe w Railway
2. Sprawdź MongoDB Atlas - whitelisted IP: `0.0.0.0/0`
3. Zobacz logi realtime w Railway dashboard
4. Upewnij się że `package-lock.json` jest zsynchronizowany
