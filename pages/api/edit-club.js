//usage just run>npm run dev after install &etc.
//POST /api/edit-club
// http://localhost:3000/api/edit-club

/**
post json body
{
  "id": 12,
  "updates": {
    "address": "New Updated Address Here"
  }
}

//or to Change postcode

{
  "id": 12,
  "updates": {
    "postcode": "NP11 9ZZ"
  }
}


*/

import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'POST only' });
    return;
  }

  const filePath = path.join(process.cwd(), 'clubs.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  const clubs = JSON.parse(raw);

  const { id, updates } = req.body;

  const club = clubs.find(c => String(c.id) === String(id));
  if (!club) {
    res.status(404).json({ error: 'Not found' });
    return;
  }

  // Apply updates safely
  Object.assign(club, updates);

  // Write back to disk
  fs.writeFileSync(filePath, JSON.stringify(clubs, null, 2));

  res.json({ success: true, club });
}
