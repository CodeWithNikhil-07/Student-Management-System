const mongoose = require("mongoose");

// Schema = Structure of a document inside a collection.
const studentSchema = new mongoose.Schema({
    name : String,
    age : Number,
    email : String,
    course : String
});

const Student = mongoose.model("student",studentSchema);
// It only creates a Model object in Node.js.

module.exports = Student;