const { Client } = require('pg');

const connectionString = "postgresql://neondb_owner:npg_HURTPEWgJb69@ep-still-flower-b3m08pvi-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ error: 'Email dan kata sandi baru harus diisi.' });
  }

  const client = new Client({ connectionString });

  try {
    await client.connect();

    // Cek apakah email terdaftar
    const userRes = await client.query('SELECT email FROM users WHERE email = $1', [email]);
    if (userRes.rows.length === 0) {
      await client.end();
      return res.status(404).json({ error: 'Email tidak ditemukan/belum terdaftar.' });
    }

    // Update sandi baru
    await client.query('UPDATE users SET password = $2 WHERE email = $1', [email, newPassword]);
    
    await client.end();
    return res.status(200).json({ success: true, message: 'Kata sandi berhasil diperbarui.' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Kesalahan database: ' + error.message });
  }
}