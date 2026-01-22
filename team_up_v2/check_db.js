
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve('packages/db/dev.db');
console.log('Checking database at:', dbPath);

const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  }
});

db.serialize(() => {
  db.each("SELECT name FROM sqlite_master WHERE type='table'", (err, row) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Table:', row.name);
  });
});

db.close();
