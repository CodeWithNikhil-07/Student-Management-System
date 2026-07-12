require("dotenv").config();

const express = require("express");
const methodOverride = require("method-override");
const path = require("path");

const connectDb = require("./db/db");
const Student = require("./models/student");

const app = express();
const port = process.env.PORT;

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

        const { search, course, sort } = req.query;

        const page = parseInt(req.query.page) || 1;
        const limit = 6;

        let query = {};
        let sortOption = {};

        // Search
        if (search) {
            query.name = {
                $regex: search,
                $options: "i"
            };
        }

        // Filter
        if (course) {
            query.course = course;
        }

        // Sorting
        switch (sort) {

            case "newest":
                sortOption = { createdAt: -1 };
                break;

            case "oldest":
                sortOption = { createdAt: 1 };
                break;

            case "nameAsc":
                sortOption = { name: 1 };
                break;

            case "nameDesc":
                sortOption = { name: -1 };
                break;

            case "ageAsc":
                sortOption = { age: 1 };
                break;

            case "ageDesc":
                sortOption = { age: -1 };
                break;

            default:
                sortOption = { createdAt: -1 };

        }

        const totalStudents = await Student.countDocuments(query);

        const students = await Student.find(query)
            .sort(sortOption)
            .skip((page - 1) * limit)
            .limit(limit);

        const totalPages = Math.ceil(totalStudents / limit);

        res.render("students/index", {
            students,
            search,
            course,
            sort,
            page,
            totalPages
        });

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

// UPDATE STUDENT
app.put("/students/:id", async (req, res) => {

    try {

        const { id } = req.params;

        await Student.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        res.redirect("/students");

    } catch (err) {

        console.log(err);
        res.status(500).send("Error Updating Student");

    }

});

// DELETE STUDENT
app.delete("/students/:id", async (req, res) => {

    try {

        const { id } = req.params;

        await Student.findByIdAndDelete(id);

        res.redirect("/students");

    } catch (err) {

        console.log(err);
        res.status(500).send("Error Deleting Student");

    }

});

app.listen(port, () => {
    console.log(`Server Running On Port ${port}`);
});