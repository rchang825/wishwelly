const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//connect mongoose and set up schemas






app.get("/", (req, res) => {
    res.send("<h1>Home<h1>");
});










app.listen(3000, () => {
    console.log("Server started on port 3000");
});