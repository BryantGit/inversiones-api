require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

// Conexión a PostgreSQL
const pool = new Pool({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
});

app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API de Inversiones funcionando 🎯');
});

// Obtener todas las inversiones
app.get('/api/inversiones', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Inversiones');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener inversiones' });
  }
});

// Insertar nueva inversión
app.post('/api/inversiones', async (req, res) => {
  const { MontoInicial, TasaInteresAnual, FechaInicio, PlazoMeses } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO Inversiones (MontoInicial, TasaInteresAnual, FechaInicio, PlazoMeses) VALUES ($1, $2, $3, $4) RETURNING *',
      [MontoInicial, TasaInteresAnual, FechaInicio, PlazoMeses]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al insertar inversión' });
  }
});
// Obtener inversión por ID
app.get('/api/inversiones/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const { rows } = await pool.query('SELECT * FROM Inversiones WHERE Id = $1', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Inversión no encontrada' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener la inversión:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});


app.listen(port, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${port}`);
});
