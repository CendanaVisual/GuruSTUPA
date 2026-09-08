const { Client } = require('pg');

const connectionString = "postgresql://neondb_owner:npg_HURTPEWgJb69@ep-still-flower-b3m08pvi-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query } = req.body;
  const client = new Client({ connectionString });

  try {
    await client.connect();
    const result = await client.query(query);
    await client.end();

    // Kembalikan kolom dan baris data hasil query
    return res.status(200).json({
      rows: result.rows || [],
      fields: result.fields ? result.fields.map(f => f.name) : [],
      rowCount: result.rowCount
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}