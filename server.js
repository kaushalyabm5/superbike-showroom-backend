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

// 1. API for get all bikes (GET)
app.get('/api/bikes', (req, res) => {
    const query = 'SELECT * FROM bikes';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// 2. API for add new bike (POST)
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

// start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});




// 3. Delete a bike by ID (DELETE)
app.delete('/api/bikes/:id', (req, res) => {
    const bikeId = req.params.id;
    const query = 'DELETE FROM bikes WHERE bike_id = ?';

    db.query(query, [bikeId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Bike not found' });
        }
        res.json({ message: 'Bike deleted successfully!' });
    });
});


// 4. Update bike details by ID (PUT)
app.put('/api/bikes/:id', (req, res) => {
    const bikeId = req.params.id;
    const { brand, model, price, stock } = req.body;
    const query = 'UPDATE bikes SET brand = ?, model = ?, price = ?, stock = ? WHERE bike_id = ?';

    db.query(query, [brand, model, price, stock, bikeId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Bike not found' });
        }
        res.json({ message: 'Bike updated successfully!' });
    });
});