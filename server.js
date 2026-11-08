const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ඩේටාබේස් සම්බන්ධතාවය (Database Connection)
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      // XAMPP default user
    password: '',      // XAMPP default password (හිස්ව තබන්න)
    database: 'superbike_showroom'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL Database successfully!');
});

// --- API ROUTES ---

// 1. සියලුම බයික්ස් ලබා ගැනීමේ API එක (GET)
app.get('/api/bikes', (req, res) => {
    const query = 'SELECT * FROM bikes';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// 2. අලුත් බයික් එකක් ඇතුළත් කිරීමේ API එක (POST)
app.post('/api/bikes', (req, res) => {
    const { brand, model, price, stock } = req.body;
    const query = 'INSERT INTO bikes (brand, model, price, stock) VALUES (?, ?, ?, ?)';
    
    db.query(query, [brand, model, price, stock], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Bike added successfully!', bikeId: result.insertId });
    });
});

// සර්වර් එක ස්ටාර්ට් කිරීම
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});