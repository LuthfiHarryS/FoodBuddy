# Deployment Guide - GitHub Pages

## Setup Otomatis Deployment ke GitHub Pages

Aplikasi FoodBuddy sudah dikonfigurasi untuk deploy otomatis ke GitHub Pages menggunakan GitHub Actions.

## Langkah-langkah Setup

### 1. Enable GitHub Pages di Repository Settings

1. Buka repository GitHub Anda: `https://github.com/luthfiharrys/FoodBuddy`
2. Klik **Settings** di menu repository
3. Scroll ke bagian **Pages** di sidebar kiri
4. Di bagian **Source**, pilih **GitHub Actions** (bukan branch)
5. Klik **Save**

### 2. Push Code ke Branch Main

Workflow akan otomatis berjalan ketika Anda push ke branch `main`:

```bash
git add .
git commit -m "Setup GitHub Pages deployment"
git push origin main
```

### 3. Monitor Deployment

1. Buka tab **Actions** di repository GitHub
2. Anda akan melihat workflow **CI/CD and Deploy to GitHub Pages** berjalan
3. Tunggu hingga workflow selesai (biasanya 2-5 menit)
4. Setelah selesai, aplikasi akan tersedia di: `https://luthfiharrys.github.io/FoodBuddy/`

## Workflow CI/CD

Workflow akan:

1. **Test Stage**: Menjalankan ESLint, HTML validation, CSS validation, dan unit tests
2. **Deploy Stage**: Deploy frontend ke GitHub Pages (hanya jika push ke `main` branch)

## Catatan Penting

### Backend URL Configuration

Setelah backend di-deploy ke platform (Railway, Render, dll), update `API_BASE_URL` di `frontend/script.js`:

```javascript
// Di function getApiBaseUrl(), update bagian GitHub Pages:
if (hostname.includes('github.io')) {
    return 'https://your-backend-url.railway.app/api'; // Ganti dengan URL backend Anda
}
```

### Manual Trigger

Anda juga bisa trigger deployment secara manual:

1. Buka tab **Actions** di GitHub
2. Pilih workflow **CI/CD and Deploy to GitHub Pages**
3. Klik **Run workflow**
4. Pilih branch `main`
5. Klik **Run workflow**

## Troubleshooting

### Deployment tidak berjalan
- Pastikan GitHub Pages sudah di-enable dengan source **GitHub Actions**
- Pastikan Anda push ke branch `main` (bukan branch lain)
- Cek tab **Actions** untuk melihat error messages

### Tests gagal
- Workflow akan tetap deploy meskipun beberapa tests gagal (menggunakan `continue-on-error: true`)
- Untuk strict deployment, hapus `continue-on-error: true` dari workflow

### Aplikasi tidak muncul di GitHub Pages
- Tunggu beberapa menit setelah deployment selesai
- Cek URL: `https://luthfiharrys.github.io/FoodBuddy/`
- Pastikan folder `frontend/` berisi file `index.html`

## File yang Terlibat

- `.github/workflows/deploy.yml` - Workflow configuration
- `frontend/` - Folder yang akan di-deploy ke GitHub Pages
- `frontend/script.js` - Konfigurasi API URL
