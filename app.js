require("dotenv").config();

const express = require("express");
const methodOverride = require("method-override");
const path = require("path");

const connectDb = require("./db/db");
const studentRoutes = require("./routes/studentRoutes");

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

// Routes
app.use("/", studentRoutes);

// Server
app.listen(port, () => {
    console.log(`🚀 Server Running On Port ${port}`);
});