const express = require("express");
const router = express.Router();
const db = require("../db");
const utils = require("../utils");

// Route to get students without groups
router.get("/students-without-groups", async (req, res) => {
  try {
    const statement = `SELECT roll_number, student_name, email FROM students WHERE group_id IS NULL;`;
    const [students] = await db.execute(statement);
    res.send(utils.createSuccess(students));
  } catch (error) {
    console.error('Error fetching students without groups:', error);
    res.status(500).send(utils.createError(error));
  }
});

// Route to get students with groups
router.get("/students-with-groups", async (req, res) => {
  try {
    const statement = `SELECT roll_number, student_name, email, group_name FROM students
                        JOIN course_groups ON students.group_id = course_groups.group_id
                        WHERE students.group_id IS NOT NULL;`;
    const [students] = await db.execute(statement);
    res.send(utils.createSuccess(students));
  } catch (error) {
    console.error('Error fetching students with groups:', error);
    res.status(500).send(utils.createError(error));
  }
});

// Route to save student group assignment
router.post("/save-student-group", async (req, res) => {
  try {
    const { roll_number, student_name, email, group_name } = req.body;

    // Validate required fields
    if (!roll_number || !student_name || !email || !group_name) {
      return res.status(400).send(utils.createError("Missing required fields"));
    }

    // Fetch the group_id based on the group_name
    const [group] = await db.execute("SELECT group_id FROM course_groups WHERE group_name = ?", [group_name]);
    if (group.length === 0) {
      return res.status(400).send(utils.createError("Invalid group name"));
    }
    const group_id = group[0].group_id;

    const statement = `UPDATE students SET student_name = ?, email = ?, group_id = ? WHERE roll_number = ?;`;
    const [result] = await db.execute(statement, [student_name, email, group_id, roll_number]);
    res.send(utils.createSuccess(result));
  } catch (error) {
    console.error('Error saving student group assignment:', error);
    res.status(500).send(utils.createError(error));
  }
});

module.exports = router;
