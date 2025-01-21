const express = require("express");
const router = express.Router();
const db = require("../db");
const utils = require("../utils");

// Route to add a new course
// Route to add a new course
router.post("/add-course", async (request, response) => {
  try {
    const { course_name, description } = request.body;

    // Check if any required fields are undefined
    if (!course_name) {
      return response.status(400).send(utils.createError("Missing required fields"));
    }

    const statement = `INSERT INTO courses (course_name, description) VALUES (?, ?);`;
    const [result] = await db.execute(statement, [course_name, description]);
    response.send(utils.createSuccess(result));
  } catch (error) {
    console.error('Error during course addition:', error);
    response.status(500).send(utils.createError(error));
  }
});

// Route to show all courses
// Route to show all courses
router.get("/show-courses", async (request, response) => {
  try {
    const statement = `SELECT course_id, course_name, description FROM courses;`;
    const [courses] = await db.execute(statement);
    response.send(utils.createSuccess(courses));
  } catch (error) {
    console.error('Error during fetching courses:', error);
    response.status(500).send(utils.createError(error));
  }
});


module.exports = router;
