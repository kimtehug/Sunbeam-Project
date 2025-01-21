const express = require('express');
const router = express.Router();
const db = require('../db'); // Adjust the path to your database connection module

// Endpoint to fetch all staff members
router.get('/all-staffs', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM staff');
        res.send({ staff: rows });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

// Endpoint to fetch staff by ID
router.get('/staff/:staffId', async (req, res) => {
    const { staffId } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM staff WHERE staff_id = ?', [staffId]);
        if (rows.length > 0) {
            res.send({ staff: rows[0] });
        } else {
            res.status(404).send({ message: 'Staff not found' });
        }
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

// Endpoint to update staff details
router.put('/staff/:staffId', async (req, res) => {
    const { staffId } = req.params;
    const { email, course_name, role } = req.body;

    try {
        await db.query('UPDATE staff SET email = ?, course_name = ?, role = ? WHERE staff_id = ?', [email, course_name, role, staffId]);
        res.status(200).send('Staff details updated successfully');
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

module.exports = router;
