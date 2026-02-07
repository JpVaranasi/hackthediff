const fs = require('fs');
const { parse } = require('csv-parse');

const inputFile = 'stockwruorganization_Results.csv';
const outputFile = './clubs.json';

const rows = [];

fs.createReadStream(inputFile)
  .pipe(parse({ columns: true, trim: true }))
  .on('data', (row) => {
    rows.push({
      id: Number(row.Id),
      name: row.Name,
      organisationTypeId: Number(row.OrganisationTypeId),
      logoUrl: row.LogoUrl
    });
  })
  .on('end', () => {
    fs.writeFileSync(outputFile, JSON.stringify(rows, null, 2));
    console.log(`JSON saved to ${outputFile}`);
  })
  .on('error', (err) => {
    console.error('Error reading CSV:', err);
  });
