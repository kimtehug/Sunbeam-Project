// course_groups.js

const express = require("express");
const router = express.Router();
const db = require("../db");
const utils = require("../utils");

// Route to add a new course group
router.post("/add-group", async (request, response) => {
  try {
    const { group_name, course_id } = request.body;

    // Check if required fields are provided
    if (!group_name || !course_id) {
      return response.status(400).send(utils.createError("Missing required fields"));
    }

    const statement = `INSERT INTO course_groups (group_name, course_id) VALUES (?, ?);`;
    const [result] = await db.execute(statement, [group_name, course_id]);
    response.send(utils.createSuccess(result));
  } catch (error) {
    console.error('Error during course group addition:', error);
    response.status(500).send(utils.createError(error));
  }
});

// Route to show all course groups for a specific course
router.get("/show-groups/:courseId", async (request, response) => {
  try {
    const { courseId } = request.params;
    const statement = `SELECT group_id, group_name FROM course_groups WHERE course_id = ?;`;
    const [groups] = await db.execute(statement, [courseId]);
    response.send(utils.createSuccess(groups));
  } catch (error) {
    console.error('Error during fetching course groups:', error);
    response.status(500).send(utils.createError(error));
  }
});

// Optional: Add more routes as needed (update, delete, etc.)

module.exports = router;
