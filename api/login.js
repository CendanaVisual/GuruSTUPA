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

    // Ambil data user berdasarkan email
    const userRes = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (userRes.rows.length === 0) {
      await client.end();
      return res.status(401).json({ error: 'Akun belum terdaftar. Silakan daftar terlebih dahulu.' });
    }

    const user = userRes.rows[0];
    if (user.password !== password) {
      await client.end();
      return res.status(401).json({ error: 'Kata sandi salah.' });
    }

    await client.end();
    return res.status(200).json({ success: true, name: user.name, message: 'Berhasil Masuk' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Kesalahan database: ' + error.message });
  }
}