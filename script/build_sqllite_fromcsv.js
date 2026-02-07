//assume csv src put next to this script
//if run on same path>node build_sqllite_fromcsv.js
//if run on root>node script/build_sqllite_fromcsv.js

import fs from 'fs';
import sqlite3 from 'sqlite3';
import { parse } from 'csv-parse';

const db = new sqlite3.Database('./clubs.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS clubs (
      id INTEGER PRIMARY KEY,
      name TEXT,
      organisationTypeId INTEGER,
      logoUrl TEXT
    )
  `);

  const parser = fs
    .createReadStream('./stockwruorganization_Results.csv')
    .pipe(parse({ columns: true, trim: true }));

  const stmt = db.prepare(
    `INSERT INTO clubs (id, name, organisationTypeId, logoUrl)
     VALUES (?, ?, ?, ?)`
  );

  parser.on('data', row => {
    stmt.run(row.Id, row.Name, row.OrganisationTypeId, row.LogoUrl);
  });

  parser.on('end', () => {
    stmt.finalize();
    db.close();
    console.log('SQLite DB created successfully');
  });
});
