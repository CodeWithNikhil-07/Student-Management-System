require("dotenv").config()

const express = require("express");
const app = express();
const port = process.env.PORT;
const mongoose = require("mongoose");
const connectDb = require("./db/db");

connectDb();

app.get("/",(req,res) => {
    res.send("Hello");
})

app.listen(port, () => {
    console.log(`Server running at port ${port}`);
});


