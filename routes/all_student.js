const express = require('express');
const router = express.Router();
const db = require('../db'); // Adjust the path to your database connection module

// Endpoint to fetch all students
router.get('/show-students', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM students');
        res.send({ rows });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});
// Endpoint to fetch all courses
router.get('/get-courses', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM courses');
        res.send({ rows });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

// Endpoint to fetch students by course ID
router.get('/show-students/:courseid', async (req, res) => {
    const { courseid } = req.params;
    try {
        const [rows] = await db.query(
            'SELECT s.roll_number, s.student_name, s.email, c.course_name FROM students s JOIN courses c ON s.course_id = c.course_id WHERE c.course_id = ?',
            [courseid]
        );
        res.send({ students: rows });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

// Endpoint to add course to a student
router.post('/add-course/:studentId/:courseId', async (req, res) => {
    const { studentId, courseId } = req.params;
    try {
        await db.query('UPDATE students SET course_id = ? WHERE student_id = ?', [courseId, studentId]);
        res.status(200).send('Course added successfully');
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

module.exports = router;