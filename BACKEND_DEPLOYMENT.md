# Backend Deployment Guide

## ⚠️ Penting: Backend Harus Di-Deploy Terpisah

Frontend FoodBuddy sudah di-deploy di GitHub Pages, tapi **backend harus di-deploy terpisah** karena GitHub Pages hanya untuk static files.

## Error yang Terjadi

Jika Anda melihat error seperti:
```
Location error: Error: Failed to fetch location
```

Ini berarti backend belum di-deploy atau URL backend belum dikonfigurasi.

## Solusi: Deploy Backend

### Opsi 1: Railway (Recommended - Mudah & Gratis)

1. **Buat akun Railway**: https://railway.app
2. **Create New Project** → **Deploy from GitHub repo**
3. **Pilih repository FoodBuddy**
4. **Set Root Directory** ke `backend`
5. **Add Environment Variables**:
   ```
   GEOAPIFY_API_KEY=your_geoapify_key
   WEATHER_API_KEY=your_weather_api_key
   OPENROUTER_API_KEY=your_openrouter_key
   PORT=3001
   NODE_ENV=production
   ```
6. **Deploy** - Railway akan memberikan URL seperti: `https://foodbuddy-backend.railway.app`

### Opsi 2: Render

1. **Buat akun Render**: https://render.com
2. **New** → **Web Service**
3. **Connect GitHub** → Pilih repository
4. **Settings**:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. **Environment Variables**: Tambahkan semua API keys
6. **Deploy** - Render akan memberikan URL seperti: `https://foodbuddy-backend.onrender.com`

### Opsi 3: Heroku

1. **Install Heroku CLI**
2. **Login**: `heroku login`
3. **Create app**: `heroku create foodbuddy-backend`
4. **Set buildpack**: `heroku buildpacks:set heroku/nodejs`
5. **Set config vars**:
   ```bash
   heroku config:set GEOAPIFY_API_KEY=your_key
   heroku config:set WEATHER_API_KEY=your_key
   heroku config:set OPENROUTER_API_KEY=your_key
   ```
6. **Deploy**: `git subtree push --prefix backend heroku main`

## Setelah Backend Di-Deploy

### Update Frontend Configuration

1. **Buka file**: `frontend/script.js`
2. **Cari fungsi** `getApiBaseUrl()`
3. **Update bagian GitHub Pages**:

```javascript
// GitHub Pages production
if (hostname.includes('github.io')) {
    // Ganti dengan URL backend Anda
    return 'https://foodbuddy-backend.railway.app/api';
    // atau
    // return 'https://foodbuddy-backend.onrender.com/api';
}
```

4. **Commit dan push**:
   ```bash
   git add frontend/script.js
   git commit -m "Update backend URL for production"
   git push origin main
   ```

## Testing

Setelah backend di-deploy dan frontend di-update:

1. **Buka**: https://luthfiharrys.github.io/FoodBuddy/
2. **Cek browser console** (F12) - seharusnya tidak ada error
3. **Test fitur**:
   - Location detection
   - Weather display
   - Chatbot AI

## Troubleshooting

### Backend tidak bisa diakses
- Pastikan backend sudah running di platform
- Cek environment variables sudah di-set
- Cek logs di platform deployment

### CORS Error
- Pastikan backend sudah mengaktifkan CORS untuk domain GitHub Pages
- Cek file `backend/server.js` - seharusnya sudah ada `app.use(cors())`

### API Keys tidak bekerja
- Pastikan semua API keys valid
- Cek rate limits dari provider API
- Cek logs backend untuk error details

## Current Status

- ✅ Frontend: Deployed di GitHub Pages
- ⚠️ Backend: **Perlu di-deploy** (Railway/Render/Heroku)
- ⚠️ Configuration: **Perlu update URL backend** di `frontend/script.js`

Setelah backend di-deploy dan URL di-update, aplikasi akan berfungsi penuh!
