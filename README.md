# GuruSTUPA AI - Generator RPP & Neon SQL Console

GuruSTUPA AI adalah kerangka awal (starter kit) berbasis HTML statis yang dikombinasikan dengan Vercel Serverless Functions untuk menghubungkan antarmuka web secara langsung dengan database PostgreSQL di Neon.tech.

Aplikasi ini dilengkapi dengan landing page modern, sistem autentikasi sederhana (auto-signup), serta sebuah SQL Console/Editor interaktif untuk menjalankan query database langsung dari peramban.

## 📁 Struktur Direktori

```text
├── api/
│   ├── login.js          # API Serverless untuk pendaftaran & login pengguna
│   └── query.js          # API Serverless untuk memproses query SQL ke Neon DB
├── index.html            # Halaman utama (Landing Page & SQL Editor)
├── login.html            # Halaman login (Split Layout)
├── package.json          # Manajemen dependency Node.js (Driver Postgres)
└── README.md             # Panduan dokumentasi proyek