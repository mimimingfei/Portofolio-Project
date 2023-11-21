const express = require("express");
const {getAllTopics,getAllEndpoints} = require("./controllers/api.controller")
const {handlePsqErrors, handleCustomErrors, handleServerErrors, handle404} = require("./errors")

const app = express();
app.use(express.json())

app.get('/api/topics', getAllTopics);
app.get('/api', getAllEndpoints);

app.all("*", handle404)
app.use(handlePsqErrors)
app.use(handleCustomErrors)
app.use(handleServerErrors)
module.exports = app;