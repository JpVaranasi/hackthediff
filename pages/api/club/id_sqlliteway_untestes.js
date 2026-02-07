//expose at>http://localhost:3000/api/club/12

import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export default async function handler(req, res) {
  const db = await open({
    filename: './clubs.db',
    driver: sqlite3.Database
  });

  const { id } = req.query;

  const club = await db.get(
    'SELECT * FROM clubs WHERE id = ?',
    [id]
  );

  if (!club) {
    res.status(404).json({ error: 'Not found' });
    return;
  }

  // Return a full URL for the frontend
  const fullUrl = `https://public.wru.wales/organisation/logos/${club.logoUrl}`;

  res.json({
    id: club.id,
    name: club.name,
    logo: fullUrl
  });
}
