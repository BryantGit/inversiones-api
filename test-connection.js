require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
});

console.log('Conectando a PostgreSQL...');

client.connect()
  .then(() => {
    console.log('✅ Conexión exitosa a PostgreSQL');
    return client.query('SELECT NOW()');
  })
  .then(res => {
    console.log('Hora actual en el servidor PostgreSQL:', res.rows[0].now);
  })
  .catch(err => {
    console.error('❌ Error al conectar a PostgreSQL:', err.message);
  })
  .finally(() => {
    client.end();
  });
// test-connection.js