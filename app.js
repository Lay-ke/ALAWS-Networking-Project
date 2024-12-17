const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// MySQL connection setup
const db = mysql.createConnection({
    host: '10.0.142.205',        // MySQL server host
    user: 'root',             // Your MySQL username
    password: 'labpassword',             // Your MySQL password
    database: 'server_db'     // Your database name
});

// Connect to MySQL database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Connected to MySQL database');
    }
});

// Middleware to parse JSON
app.use(bodyParser.json());

// Serve static files from /var/www/html
app.use(express.static(path.join(__dirname, 'public')));

// CRUD Operations

// CREATE: Add a new person
app.post('/add-person', (req, res) => {
    const { Code, FirstName, LastName, PlaceOfRecidence } = req.body;
    const query = `INSERT INTO person (Code, FirstName, LastName, PlaceOfRecidence) VALUES (?, ?, ?, ?)`;
    db.query(query, [Code, FirstName, LastName, PlaceOfRecidence], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Person added successfully', result });
    });
});

// READ: Get all people
app.get('/people', (req, res) => {
    const query = 'SELECT * FROM person';
    db.query(query, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// READ: Get a person by Code
app.get('/person/:Code', (req, res) => {
    const { Code } = req.params;
    const query = 'SELECT * FROM person WHERE Code = ?';
    db.query(query, [Code], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Person not found' });
        }
        res.json(rows[0]);
    });
});

// UPDATE: Update a person's details
app.put('/update-person/:Code', (req, res) => {
    const { Code } = req.params;
    const { FirstName, LastName, PlaceOfRecidence } = req.body;
    const query = `UPDATE person SET FirstName = ?, LastName = ?, PlaceOfRecidence = ? WHERE Code = ?`;
    db.query(query, [FirstName, LastName, PlaceOfRecidence, Code], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Person not found' });
        }
        res.json({ message: 'Person updated successfully' });
    });
});

// DELETE: Delete a person
//app.delete('/delete-person/:Code', (req, res) => {
//    const { Code } = req.params;
//    const query = `DELETE FROM person WHERE Code = ?`;
//    db.query(query, [Code], (err, result) => {
//        if (err) {
//            return res.status(500).json({ error: err.message });
//        }
//        if (result.affectedRows === 0) {
//            return res.status(404).json({ message: 'Person not found' });
//        }
//        res.json({ message: 'Person deleted successfully' });
//    });
//});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
