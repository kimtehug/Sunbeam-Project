const express = require("express");
const router = express.Router();
const db = require("../db");
const utils = require("../utils");

// Route to add a new subject
router.post("/add-subject", async (request, response) => {
  try {
    const { subject_name, course_id } = request.body;
    console.log(`subject_name, course_id'${subject_name}, ${course_id}  `);
    // Check if required fields are provided
    if (!subject_name || !course_id) {
      return response.status(400).send(utils.createError("Missing required fields"));
    }

    const statement = `INSERT INTO subjects (subject_name, course_id) VALUES (?, ?);`;
    const [result] = await db.execute(statement, [subject_name, course_id]);
    response.send(utils.createSuccess(result));
  } catch (error) {
    console.error('Error during subject addition:', error);
    response.status(500).send(utils.createError(error));
  }
});

// Route to show all subjects for a specific course
router.get("/show-subject/:courseId", async (request, response) => {
  try {
   
    const { courseId } = request.params;
    console.log('hello :>> ', courseId);
    const statement = `SELECT subject_id, subject_name FROM subjects WHERE course_id = ?;`;
    const [subjects] = await db.execute(statement, [courseId]);
    response.send(utils.createSuccess(subjects));
  } catch (error) {
    console.error('Error during fetching subjects:', error);
    response.status(500).send(utils.createError(error));
  }
});

router.get("/register", (request, response) =>{
  response.send("<h1>Staff register</h1>")
})
module.exports = router;
