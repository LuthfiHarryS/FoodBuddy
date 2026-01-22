# Docker Deployment Configuration

Folder ini berisi konfigurasi Docker untuk deployment aplikasi FoodBuddy. File-file ini disimpan untuk pengembangan dan deployment di masa depan, namun **tidak digunakan dalam CI/CD pipeline saat ini**.

## File yang Tersedia

- `Dockerfile.frontend` - Dockerfile untuk frontend service (nginx)
- `Dockerfile.backend` - Dockerfile untuk backend service (Node.js)
- `docker-compose.yml` - Konfigurasi untuk menjalankan kedua services
- `nginx.conf` - Konfigurasi Nginx untuk frontend

## Cara Menggunakan (Untuk Pengembangan Lokal)

### Prerequisites
- Docker dan Docker Compose terinstall
- File `backend/.env` sudah dikonfigurasi dengan API keys

### Menjalankan dengan Docker Compose

Dari root folder project, jalankan:

```bash
docker-compose -f deployment/docker-compose.yml up -d
```

Aplikasi akan tersedia di:
- Frontend: http://localhost
- Backend API: http://localhost:3001

### Build Individual Images

**Backend:**
```bash
docker build -f deployment/Dockerfile.backend -t foodbuddy-backend .
docker run -p 3001:3001 --env-file backend/.env foodbuddy-backend
```

**Frontend:**
```bash
docker build -f deployment/Dockerfile.frontend -t foodbuddy-frontend .
docker run -p 80:80 foodbuddy-frontend
```

### Stop Containers

```bash
docker-compose -f deployment/docker-compose.yml down
```

## Catatan

- File-file ini **tidak digunakan dalam CI/CD pipeline** saat ini
- Deployment production menggunakan static hosting (GitHub Pages/Netlify)
- Docker configuration disimpan untuk kebutuhan deployment container-based di masa depan
