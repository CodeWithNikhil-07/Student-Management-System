require("dotenv").config();

const express = require("express");
const methodOverride = require("method-override");
const path = require("path");

const connectDb = require("./db/db");
const Student = require("./models/student");

const app = express();
const port = process.env.PORT || 3000;

// Database Connection
connectDb();

// View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));


// SHOW CREATE FORM
app.get("/students/new", (req, res) => {
    res.render("students/new");
});

// CREATE STUDENT
app.post("/students", async (req, res) => {
    try {
        const student = new Student(req.body);

        await student.save();

        res.redirect("/students");

    } catch (err) {
        console.log(err);
        res.status(500).send("Error Creating Student");
    }
});

// GET ALL STUDENTS
app.get("/students", async (req, res) => {
    try {
        const students = await Student.find();

        res.render("students/index", { students });

    } catch (err) {
        console.log(err);
        res.status(500).send("Error Fetching Students");
    }
});

// GET SINGLE STUDENT
app.get("/students/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const student = await Student.findById(id);

        if (!student) {
            return res.status(404).send("Student Not Found");
        }

        res.render("students/show", { student });

    } catch (err) {
        console.log(err);
        res.status(500).send("Error Fetching Student");
    }
});

// SHOW EDIT FORM
app.get("/students/:id/edit", async (req, res) => {
    try {
        const { id } = req.params;

        const student = await Student.findById(id);

        if (!student) {
            return res.status(404).send("Student Not Found");
        }

        res.render("students/edit", { student });

    } catch (err) {
        console.log(err);
        res.status(500).send("Error Loading Edit Page");
    }
});

app.listen(port, () => {
    console.log(`Server Running On Port ${port}`);
});