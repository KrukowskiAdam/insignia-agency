# Deploy Backend na Railway

## Kroki deployment:

### 1. Przygotowanie
- [x] Backend clean i zbudowany lokalnie
- [x] Railway config (`railway.json`) utworzony w głównym katalogu
- [x] `.env.example` zaktualizowany
- [x] Dockerfile zoptymalizowany dla Railway

### 2. Deployment na Railway

1. **Idź na Railway.app:**
   - Otwórz: https://railway.app
   - Zaloguj się przez GitHub

2. **Utwórz nowy projekt:**
   - Kliknij "New Project"
   - Wybierz "Deploy from GitHub repo"
   - Wybierz: `KrukowskiAdam/insignia-agency`

3. **Konfiguracja (automatyczna):**
   - Railway automatycznie wykryje `railway.json` w głównym katalogu
   - Builder: DOCKERFILE
   - Dockerfile Path: `backend/Dockerfile`
   - Docker Context: `backend/`
   - ⚠️ **Nie musisz** ustawiać Root Directory ręcznie!

4. **Dodaj Environment Variables:**
   ```
   DATABASE_URI=mongodb+srv://krukowskiadam_db_user:MX691k9COCFF2cWB@cluster0.xbbwqjz.mongodb.net/insignia?retryWrites=true&w=majority
   PAYLOAD_SECRET=f46c7fOwVCNytw0OFVX5eLQRlKuYr3e7jTEj6MJW95k=
   PAYLOAD_BLOB_READ_WRITE_TOKEN=vercel_blob_rw_zYD5Bi6fP4NKWvLb_BvSKP0IkAcB9fNFSmxMH46K1RdMz9l
   NODE_ENV=production
   ```

5. **Deploy:**
   - Railway automatycznie zbuduje i deployuje
   - Otrzymasz URL typu: `your-app.up.railway.app`

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

## Dlaczego Railway zamiast Render?

✅ **Prostsze w konfiguracji** - automatyczne wykrywanie
✅ **Szybsze buildy** - lepsze cache'owanie
✅ **Łatwiejsze logi** - realtime debugging
✅ **Free tier wystarczający** - dla małych projektów
✅ **Lepsze środowisko zmiennych** - intuicyjny UI

## Troubleshooting

### Build fails: "Dockerfile does not exist"
✅ **Rozwiązane!** Użyj `railway.json` w głównym katalogu (nie w `/backend`)

### Build fails: Sharp errors
✅ **Rozwiązane!** Dockerfile ma workaround dla Alpine Linux

### Inne problemy:
1. Sprawdź czy wszystkie zmienne środowiskowe są ustawione
2. Zweryfikuj MongoDB Atlas - whitelisted IP: `0.0.0.0/0`
3. Sprawdź logi w Railway dashboard (realtime)
4. Upewnij się że `railway.json` jest w głównym katalogu repo
