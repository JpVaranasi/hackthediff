const fs = require('fs');
const { parse } = require('csv-parse');

const inputFile = 'modedwruorganization_Results.csv';
const outputFile = './clubs.json';

const rows = [];

fs.createReadStream(inputFile)
  .pipe(parse({ columns: true, trim: true }))
  .on('data', (row) => {
    // Helper: convert to number or null
    const num = (v) =>
      v !== undefined && v !== null && v !== '' && !Number.isNaN(Number(v))
        ? Number(v)
        : null;

    // Helper: convert CSV string or array to string[] or null
    const list = (v) => {
      if (Array.isArray(v)) return v.map(String);
      if (typeof v === 'string') {
        const parts = v
          .split(',')
          .map((x) => x.trim())
          .filter(Boolean);
        return parts.length > 0 ? parts : null;
      }
      return null;
    };

    rows.push({
      id: num(row.Id),
      name: row.Name?.trim() || null,
      organisationTypeId: num(row.OrganisationTypeId),

      // Optional numeric fields
      lat: num(row.lat),
      long: num(row.long),

      // Optional string fields
      address:
        row.address && row.address.trim() !== ''
          ? row.address.trim()
          : null,

      // UK postcodes are alphanumeric → keep as string
      postcode:
        row.postcode && row.postcode.trim() !== ''
          ? row.postcode.trim()
          : null,

      // Optional list fields
      tags: list(row.tags),
      training_days: list(row.training_days),

      // Keep original logoUrl for API to build httpspicture
      logoUrl: row.LogoUrl?.trim() || null
    });
  })
  .on('end', () => {
    fs.writeFileSync(outputFile, JSON.stringify(rows, null, 2));
    console.log(`JSON saved to ${outputFile}`);
  })
  .on('error', (err) => {
    console.error('Error reading CSV:', err);
  });
