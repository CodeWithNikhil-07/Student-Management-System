const express = require("express");
const router = express.Router();

const studentController = require("../controllers/studentController");

// SHOW CREATE FORM
router.get("/students/new", studentController.showCreateForm);

// CREATE STUDENT
router.post("/students", studentController.createStudent);

// GET ALL STUDENTS
router.get("/students", studentController.getAllStudents);

// GET SINGLE STUDENT
router.get("/students/:id", studentController.getStudent);

// SHOW EDIT FORM
router.get("/students/:id/edit", studentController.showEditForm);

// UPDATE STUDENT
router.put("/students/:id", studentController.updateStudent);

// DELETE STUDENT
router.delete("/students/:id", studentController.deleteStudent);

module.exports = router;