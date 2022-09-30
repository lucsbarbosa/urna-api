require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');

const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.URL,
    ssl: {
        rejectUnauthorized: false
    }
});
let client;
(async () => client = await pool.connect())();

app.set('json spaces', 2);
app.use(express.json());
app.use(cors());

app.get('/candidatos', async (req, res) => {
    try {
        const dados = await client.query("SELECT * FROM candidatos");
        res.json({
            candidatos: dados.rows,
            statusErro: 200
        })
    } catch {
        res.json({ statusErro: 400 })
    }
})

app.post('/candidatos/:numero', async (req, res) => {
    try {
        const numeroCandidato = req.params.numero;
        await client.query(`UPDATE candidatos SET votos=votos+1 WHERE numero=${numeroCandidato}`)
        res.json({ statusErro: 200 })
    } catch {
        res.json({ statusErro: 400 })
    }
})

app.listen(3000, () => console.log('Running'))