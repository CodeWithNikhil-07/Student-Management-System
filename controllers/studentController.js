const Student = require("../models/student");

// SHOW CREATE FORM
const showCreateForm = (req, res) => {
    res.render("students/new");
};

// CREATE STUDENT
const createStudent = async (req, res) => {
    try {

        const student = new Student(req.body);

        await student.save();

        res.redirect("/students");

    } catch (err) {

        console.log(err);
        res.status(500).send("Error Creating Student");

    }
};

// GET ALL STUDENTS
const getAllStudents = async (req, res) => {

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

};

// GET SINGLE STUDENT
const getStudent = async (req, res) => {

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

};

// SHOW EDIT FORM
const showEditForm = async (req, res) => {

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

};

// UPDATE STUDENT
const updateStudent = async (req, res) => {

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

};

// DELETE STUDENT
const deleteStudent = async (req, res) => {

    try {

        const { id } = req.params;

        await Student.findByIdAndDelete(id);

        res.redirect("/students");

    } catch (err) {

        console.log(err);
        res.status(500).send("Error Deleting Student");

    }

};

module.exports = {
    showCreateForm,
    createStudent,
    getAllStudents,
    getStudent,
    showEditForm,
    updateStudent,
    deleteStudent
};