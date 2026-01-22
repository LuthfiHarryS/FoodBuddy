# FoodBuddy Backend API

Backend server untuk aplikasi FoodBuddy yang menangani API calls ke external services.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.example` ke `.env`:
```bash
cp .env.example .env
```

3. Isi API keys di file `.env`:
```
GEOAPIFY_API_KEY=your_key_here
WEATHER_API_KEY=your_key_here
OPENROUTER_API_KEY=your_key_here
PORT=3001
```

4. Jalankan server:
```bash
npm start
# atau untuk development dengan auto-reload:
npm run dev
```

## API Endpoints

### GET `/health`
Health check endpoint.

### GET `/api/location`
Mendapatkan lokasi user berdasarkan IP address.

**Response:**
```json
{
  "city": "Jakarta",
  "country": "ID",
  "location": "Jakarta, ID"
}
```

### GET `/api/weather/:city`
Mendapatkan data cuaca untuk kota tertentu.

**Parameters:**
- `city` (string): Nama kota

**Response:**
```json
{
  "temperature": 32,
  "condition": {
    "english": "Sunny",
    "indonesian": "cerah"
  },
  "isRainy": false
}
```

### POST `/api/chat`
Mengirim pesan ke AI chatbot.

**Request Body:**
```json
{
  "message": "Apa makanan yang cocok untuk cuaca hujan?"
}
```

**Response:**
```json
{
  "reply": "Untuk cuaca hujan, saya rekomendasikan...",
  "model": "deepseek/deepseek-r1-0528:free"
}
```

## Security Features

- Rate limiting: 100 requests per 15 minutes per IP
- CORS enabled untuk frontend
- API keys disimpan di environment variables
- Error handling yang comprehensive
