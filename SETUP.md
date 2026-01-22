# Setup Guide - FoodBuddy

Panduan lengkap untuk setup dan menjalankan aplikasi FoodBuddy.

## Prerequisites

- Node.js 18+ (untuk backend)
- npm atau yarn
- API Keys:
  - Geoapify API key
  - WeatherAPI key
  - OpenRouter API key

## Quick Start

### 1. Clone Repository
```bash
git clone <repository-url>
cd FoodBuddy
```

### 2. Setup Backend

```bash
cd backend
npm install
cp env.example .env
```

Edit file `.env` dan isi dengan API keys Anda:
```
GEOAPIFY_API_KEY=your_key_here
WEATHER_API_KEY=your_key_here
OPENROUTER_API_KEY=your_key_here
PORT=3001
```

Jalankan backend:
```bash
npm start
# atau untuk development:
npm run dev
```

Backend akan berjalan di `http://localhost:3001`

### 3. Setup Frontend

Buka terminal baru:
```bash
cd frontend
# Menggunakan serve (install global: npm i -g serve)
serve . -p 8000

# Atau menggunakan Python
python -m http.server 8000

# Atau menggunakan PHP
php -S localhost:8000
```

Frontend akan berjalan di `http://localhost:8000`

### 4. Akses Aplikasi

Buka browser dan akses: `http://localhost:8000`

## Menggunakan Docker

### Build dan Run dengan Docker Compose

```bash
# Build images
docker-compose build

# Run containers
docker-compose up -d

# Lihat logs
docker-compose logs -f

# Stop containers
docker-compose down
```

Aplikasi akan tersedia di `http://localhost`

### Build Individual Images

**Backend:**
```bash
docker build -f Dockerfile.backend -t foodbuddy-backend .
docker run -p 3001:3001 --env-file backend/.env foodbuddy-backend
```

**Frontend:**
```bash
docker build -f Dockerfile.frontend -t foodbuddy-frontend .
docker run -p 80:80 foodbuddy-frontend
```

## Environment Variables

### Backend (.env)

| Variable | Description | Required |
|----------|-------------|----------|
| `GEOAPIFY_API_KEY` | API key untuk Geoapify | Yes |
| `WEATHER_API_KEY` | API key untuk WeatherAPI | Yes |
| `OPENROUTER_API_KEY` | API key untuk OpenRouter AI | Yes |
| `PORT` | Port untuk backend server | No (default: 3001) |
| `NODE_ENV` | Environment (development/production) | No |

## Troubleshooting

### Backend tidak bisa start
- Pastikan port 3001 tidak digunakan aplikasi lain
- Pastikan semua API keys sudah diisi di `.env`
- Cek log error di console

### Frontend tidak bisa connect ke backend
- Pastikan backend sudah running di port 3001
- Cek `API_BASE_URL` di `frontend/script.js`
- Pastikan CORS sudah enabled di backend

### API calls gagal
- Pastikan API keys valid
- Cek rate limit dari API provider
- Lihat error di browser console (F12)

## Production Deployment

### Backend
1. Deploy ke platform seperti Railway, Render, atau Heroku
2. Set environment variables di platform
3. Pastikan port sesuai dengan platform

### Frontend
1. Update `API_BASE_URL` di `frontend/script.js` ke URL backend production
2. Deploy folder `frontend/` ke static hosting
3. Atau gunakan Docker dengan nginx reverse proxy

## Support

Jika ada masalah, buka issue di repository atau hubungi tim development.
