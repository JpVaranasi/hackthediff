//expose at>http://localhost:3000/api/club/12
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const filePath = path.join(process.cwd(), 'clubs.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  const clubs = JSON.parse(raw);

  const { id } = req.query;
  const club = clubs.find(c => String(c.id) === String(id));

  if (!club) {
    res.status(404).json({ error: 'Not found' });
    return;
  }

  // lat / long: accept number or numeric string, else null
  const lat =
    club.lat !== undefined && club.lat !== null && !Number.isNaN(Number(club.lat))
      ? Number(club.lat)
      : null;

  const long =
    club.long !== undefined && club.long !== null && !Number.isNaN(Number(club.long))
      ? Number(club.long)
      : null;

  // tags: ensure string[] or null
  let tags = null;
  if (Array.isArray(club.tags)) {
    tags = club.tags.map(String);
  } else if (typeof club.tags === 'string') {
    const parsed = club.tags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);
    tags = parsed.length > 0 ? parsed : null;
  }

  // training_days: ensure string[] or null
  let training_days = null;
  if (Array.isArray(club.training_days)) {
    training_days = club.training_days.map(String);
  } else if (typeof club.training_days === 'string') {
    const parsed = club.training_days
      .split(',')
      .map(d => d.trim())
      .filter(Boolean);
    training_days = parsed.length > 0 ? parsed : null;
  }

  // postcode: string or null
  
    const postcode =
    typeof club.postcode === 'string' && club.postcode.trim().length > 0
      ? club.postcode.trim()
      : null;

  // address: string or null
  const address =
    typeof club.address === 'string' && club.address.trim().length > 0
      ? club.address.trim()
      : null;

  // httpspicture: full URL or null
  const httpspicture =
    typeof club.logoUrl === 'string' && club.logoUrl.trim().length > 0
      ? `https://public.wru.wales/organisation/logos/${club.logoUrl}`
      : null;

const openingtime = "8am";


  res.json({
    name: club.name ?? null,
    lat,
    long,
    tags,
    training_days,
    postcode,
    address,
    httpspicture,
    openingtime
  });
}


