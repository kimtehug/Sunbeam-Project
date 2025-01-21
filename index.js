const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const favicon = require('serve-favicon');

const studentRoutes = require('./routes/student');
const staffRoutes = require('./routes/staff');
const courses = require("./routes/courses");
const subjects = require('./routes/subject');
const courseGroupsRoutes = require('./routes/course_groups');
const markEntryRoutes = require("./routes/mark_entry");
const allStudentRoutes = require('./routes/all_student');
const courseDACRoutes = require('./routes/course_dac'); 
const allStaffsRoutes = require('./routes/all_staffs');
const addMarksRoutes = require('./routes/add_marks');
const evaluationRoutes = require('./routes/evaluation'); 
// Initialize app
const app = express();

// Middlewares
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico'))); // Add this line

app.get('/', (req, res) => {
  res.send('<h1>This is project</h1>');
});

app.get('/home/staff', (req, res) => {
  res.send('<h1>This is staff</h1>');
});


app.get('/subjects', (req, res) => {
  res.send('<h1>This is subject</h1>');
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.use('/home/staff', staffRoutes);
app.use('/home/student', studentRoutes);
app.use('/courses', courses);
app.use('/subjects',subjects );
app.use('/course-groups', courseGroupsRoutes);
app.use("/mark-entry", markEntryRoutes);
app.use("/all-student", allStudentRoutes);
app.use('/course-dac', courseDACRoutes);
app.use('/all-staffs', allStaffsRoutes);
app.use('/add-marks', addMarksRoutes);
app.use('/evaluation', evaluationRoutes);