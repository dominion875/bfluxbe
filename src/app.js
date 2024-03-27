require("dotenv").config()
const express = require ("express");
const { config } = require("./config");
const cors = require("cors");
const { errorHandler, notFound } = require("./middlewares/error.middleware");
const app = express();
app.use(cors())

app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use("/api/v1/status", (req, res) =>{
    res.send(`Yes!.... welcome to ${config.APPNAME}API`);
})
app.use(errorHandler)
module.exports = app;
