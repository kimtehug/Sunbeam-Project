const express = require("express");
const router = express.Router();
const db = require("../db");
const utils = require("../utils");

// Route to add a new mark entry
router.post("/add-entry", async (request, response) => {
  try {
    const {
      student_id, subject_id, group_id, course_id, staff_id,
      theory, lab, IA1, IA2, from_date, till_date
    } = request.body;

    // Check if required fields are provided
    if (!student_id || !subject_id || !group_id || !course_id || !staff_id) {
      return response.status(400).send(utils.createError("Missing required fields"));
    }

    const statement = `
      INSERT INTO mark_entry 
      (student_id, subject_id, group_id, course_id, staff_id, theory, lab, IA1, IA2, from_date, till_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
    const [result] = await db.execute(statement, [
      student_id, subject_id, group_id, course_id, staff_id,
      theory, lab, IA1, IA2, from_date, till_date
    ]);
    response.send(utils.createSuccess(result));
  } catch (error) {
    console.error('Error during mark entry addition:', error);
    response.status(500).send(utils.createError(error));
  }
});

// Route to show all mark entries
router.get("/show-entries", async (request, response) => {
  try {
    const statement = `
      SELECT * FROM mark_entry;
    `;
    const [entries] = await db.execute(statement);
    response.send(utils.createSuccess(entries));
  } catch (error) {
    console.error('Error during fetching mark entries:', error);
    response.status(500).send(utils.createError(error));
  }
});

module.exports = router;
