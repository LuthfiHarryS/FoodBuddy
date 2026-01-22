# FoodBuddy

Aplikasi web rekomendasi makanan dan minuman berdasarkan waktu dan cuaca saat ini.

## Struktur Proyek

```
FoodBuddy/
├── frontend/          # Frontend application (HTML, CSS, JS)
│   ├── index.html
│   ├── script.js
│   ├── styles.css
│   └── Assets/
├── backend/           # Backend API server
│   ├── server.js
│   ├── routes/
│   │   ├── location.js
│   │   ├── weather.js
│   │   └── chat.js
│   └── package.json
└── README.md
```

## Fitur

- Rekomendasi makanan berdasarkan waktu (pagi, siang, sore, malam)
- Rekomendasi berdasarkan kondisi cuaca
- Chatbot AI untuk interaksi dengan pengguna
- Integrasi dengan API cuaca dan lokasi
- Responsive design
- **Backend API untuk keamanan API keys**

## Setup

### Backend Setup

1. Masuk ke folder backend:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Copy `.env.example` ke `.env`:
```bash
cp .env.example .env
```

4. Isi API keys di file `.env`:
```
GEOAPIFY_API_KEY=your_geoapify_api_key_here
WEATHER_API_KEY=your_weather_api_key_here
OPENROUTER_API_KEY=your_openrouter_api_key_here
PORT=3001
```

5. Jalankan backend server:
```bash
npm start
# atau untuk development dengan auto-reload:
npm run dev
```

Backend akan berjalan di `http://localhost:3001`

### Frontend Setup

Frontend adalah static files yang dapat di-serve dengan web server apapun.

**Development:**
```bash
# Menggunakan Python
cd frontend
python -m http.server 8000

# Menggunakan Node.js serve
npx serve frontend

# Menggunakan PHP
php -S localhost:8000 -t frontend
```

Frontend akan berjalan di `http://localhost:8000`

**Production:**
Deploy folder `frontend/` ke static hosting seperti:
- GitHub Pages
- Netlify
- Vercel
- Cloudflare Pages

## API Endpoints

### GET `/api/location`
Mendapatkan lokasi user berdasarkan IP address.

### GET `/api/weather/:city`
Mendapatkan data cuaca untuk kota tertentu.

### POST `/api/chat`
Mengirim pesan ke AI chatbot.

Lihat `backend/README.md` untuk dokumentasi lengkap.

## Teknologi

### Frontend
- HTML5
- CSS3
- Vanilla JavaScript
- Marked.js (markdown parsing)

### Backend
- Node.js
- Express.js
- CORS
- Express Rate Limit
- Environment Variables (dotenv)

## Security Features

- ✅ API keys tersimpan di backend (tidak ter-expose di client)
- ✅ Rate limiting (100 requests per 15 menit per IP)
- ✅ CORS enabled untuk frontend
- ✅ Error handling yang comprehensive
- ✅ Input validation

## Development

### Running Both Frontend and Backend

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npx serve . -p 8000
```

Akses aplikasi di `http://localhost:8000`

## Deployment

### Backend Deployment
Deploy backend ke:
- Railway
- Render
- Heroku
- DigitalOcean App Platform
- AWS EC2

Jangan lupa set environment variables di platform deployment!

### Frontend Deployment
Deploy folder `frontend/` ke static hosting. Update `API_BASE_URL` di `frontend/script.js` sesuai dengan URL backend production.

## License

MIT
