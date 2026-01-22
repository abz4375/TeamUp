
const { Client } = require('pg');
require('dotenv').config();

const dbUrl = process.env.DATABASE_URL;
console.log('Raw DATABASE_URL from process.env:', dbUrl ? dbUrl.replace(/:[^:@]+@/, ':****@') : 'undefined');

const client = new Client({
  connectionString: dbUrl ? dbUrl.replace('localhost', '127.0.0.1').replace(':5433', ':5432') : undefined,
});
console.log('Connecting to:', client.connectionParameters.host + ':' + client.connectionParameters.port);

async function checkDb() {
  try {
    await client.connect();
    console.log('Successfully connected to PostgreSQL');
    
    const res = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
    console.log('Tables found:');
    res.rows.forEach(row => console.log(`- ${row.table_name}`));
    
    await client.end();
  } catch (err) {
    console.error('Connection failure details:');
    console.error('Code:', err.code);
    console.error('Message:', err.message);
    console.error('Detail:', err.detail);
    process.exit(1);
  }
}

checkDb();
