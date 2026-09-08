const { Client } = require('pg');

const connectionString = "postgresql://neondb_owner:npg_HURTPEWgJb69@ep-still-flower-b3m08pvi-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body;
  const client = new Client({ connectionString });

  try {
    await client.connect();

    // 1. Buat tabel user secara otomatis jika belum ada di database Anda
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Cek apakah user sudah terdaftar
    const userRes = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (userRes.rows.length === 0) {
      // Pendaftaran Otomatis untuk kemudahan pengetesan pertama kali
      await client.query('INSERT INTO users (email, password) VALUES ($1, $2)', [email, password]);
      await client.end();
      return res.status(200).json({ success: true, message: 'Registrasi & Login Berhasil (User Baru dibuat)' });
    }

    const user = userRes.rows[0];
    if (user.password !== password) {
      await client.end();
      return res.status(401).json({ error: 'Kata sandi salah.' });
    }

    await client.end();
    return res.status(200).json({ success: true, message: 'Berhasil Masuk' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Kesalahan database: ' + error.message });
  }
}