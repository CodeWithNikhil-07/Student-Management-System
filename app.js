require("dotenv").config()

const express = require("express");
const app = express();
const port = process.env.PORT;
const mongoose = require("mongoose");
const connectDb = require("./db/db");
const studentModel = require("./models/student");
const path = require("path");

connectDb();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/",(req,res) => {
    res.send("Hello");
})

app.post("/students", async(req,res) => {
    const student = new studentModel(req.body);
    await student.save();

    res.redirect("/students");
});

app.get("/students/:id", async(req,res) => {
    let {id} = req.params;

    let getData = await studentModel.findById(id);
    res.send(getData);
})

app.get("/students/:id/edit", async(req,res) => {
    let {id} = req.params;
    let student = await studentModel.findById(id);

    res.render("students/edit",{student});
})

app.listen(port, () => {
    console.log(`Server running at port ${port}`);
});


