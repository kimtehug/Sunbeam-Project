const express = require("express");
const router = express.Router();
const pool = require("../db");

// Middleware to authorize role
function authorizeRole(roles) {
    return (req, res, next) => {
        const userRole = req.user.role; // Assuming req.user.role contains the user's role
        if (roles.includes(userRole)) {
            next();
        } else {
            res.status(403).send("Forbidden: You don't have the required role to access this resource");
        }
    };
}

// Route to fetch courses
router.get('/courses', async (req, res) => {
    try {
        const [results] = await pool.query('SELECT * FROM courses');
        res.json(results);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).send('Error fetching courses');
    }
});

// Route to fetch subjects
router.get('/subjects', async (req, res) => {
    try {
        const [results] = await pool.query('SELECT * FROM subjects');
        res.json(results);
    } catch (error) {
        console.error('Error fetching subjects:', error);
        res.status(500).send('Error fetching subjects');
    }
});

// Route to fetch groups
router.get('/groups', async (req, res) => {
    try {
        const [results] = await pool.query('SELECT * FROM course_groups');
        res.json(results);
    } catch (error) {
        console.error('Error fetching groups:', error);
        res.status(500).send(`Error fetching groups: ${error.message}`);
    }
});

// Route to fetch staff members
router.get('/staff', async (req, res) => {
    try {
        const [results] = await pool.query('SELECT * FROM staff');
        res.json(results);
    } catch (error) {
        console.error('Error fetching staff members:', error);
        res.status(500).send('Error fetching staff members');
    }
});
const utils = require('../utils');

// POST /assign-task
router.post('/assign-task', async (req, res) => {
    const { course_name, subject_name, group_name, staff_name, from_date, till_date, type } = req.body;
console.log(course_name, subject_name, group_name, staff_name, from_date, till_date, type );
    try {
        // Fetch group_id based on group_name
        const [groupResult] = await pool.execute('SELECT group_id FROM course_groups WHERE group_name = ?', [group_name]);
        if (groupResult.length === 0) {
            return res.status(404).send(utils.createError('Group not found'));
        }
        const group_id = groupResult[0].group_id;

        // Fetch subject_id based on subject_name
        const [subjectResult] = await pool.execute('SELECT subject_id FROM subjects WHERE subject_name = ?', [subject_name]);
        if (subjectResult.length === 0) {
            return res.status(404).send(utils.createError('Subject not found'));
        }
        const subject_id = subjectResult[0].subject_id;

        // Fetch course_id based on course_name
        const [courseResult] = await pool.execute('SELECT course_id FROM courses WHERE course_name = ?', [course_name]);
        if (courseResult.length === 0) {
            return res.status(404).send(utils.createError('Course not found'));
        }
        const course_id = courseResult[0].course_id;

        // Fetch staff_id based on staff_name
        const [staffResult] = await pool.execute('SELECT staff_id FROM staff WHERE staff_name = ?', [staff_name]);
        if (staffResult.length === 0) {
            return res.status(404).send(utils.createError('Staff member not found'));
        }
        const staff_id = staffResult[0].staff_id;

        // Fetch all students present in the group
        const [students] = await pool.execute('SELECT student_id FROM students WHERE group_id = ?', [group_id]);
        if (students.length === 0) {
            return res.status(404).send(utils.createError('No students found in the group'));
        }

        // Determine values for theory, lab, IA1, IA2
        const theory = type.includes('theory') ? 1 : 0;
        const lab = type.includes('lab') ? 1 : 0;
        const IA1 = type.includes('ia1') ? 1 : 0;
        const IA2 = type.includes('ia2') ? 1 : 0;

        // Insert data into the mark-entry table for each student
        const insertPromises = students.map(student => {
            const statement = `
                INSERT INTO mark_entry (student_id, subject_id, group_id, course_id, staff_id, theory, lab, IA1, IA2, from_date, till_date, approved)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
            `;
            return pool.execute(statement, [
                student.student_id,
                subject_id,
                group_id,
                course_id,
                staff_id,
                theory,
                lab,
                IA1,
                IA2,
                from_date,
                till_date
            ]);
        });

        await Promise.all(insertPromises);
        res.send(utils.createSuccess('Task assigned successfully'));

    } catch (error) {
        console.error('Error during task assignment:', error);
        res.status(500).send(utils.createError(error));
    }
});

module.exports = router;