const express = require('express');
const router = express.Router();
const db = require('../db'); // Adjust the path to your database connection module

// Endpoint to fetch all subjects
router.get('/get-subjects', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM subjects');
        res.send({ rows });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

// Endpoint to fetch evaluations
router.get('/get-evaluations', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM mark_entry');
        res.send({ rows });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

// Endpoint to add a new evaluation
router.post('/add-evaluation', async (req, res) => {
    const { student_id, subject_id, group_id, course_id, staff_id, theory, lab, ia1, ia2 } = req.body;

    try {
        await db.query('INSERT INTO mark_entry (student_id, subject_id, group_id, course_id, staff_id, theory, lab, IA1, IA2) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', 
                       [student_id, subject_id, group_id, course_id, staff_id, theory, lab, ia1, ia2]);
        res.status(200).send('Evaluation added successfully');
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

module.exports = router;