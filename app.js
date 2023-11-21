const express = require("express");
const {getAllTopics,getAllEndpoints,getArticleById,getAllArticles} = require("./controllers/api.controller")
const {getCommentsForArticle} = require('./controllers/comment.controller')
const {handlePsqErrors, handleCustomErrors, handleServerErrors, handle404} = require("./errors")

const app = express();
app.use(express.json())

app.get('/api/topics', getAllTopics);
app.get('/api', getAllEndpoints);
app.get('/api/articles/:article_id',getArticleById)
app.get('/api/articles/:article_id/comments',getCommentsForArticle)

app.all("*", handle404)
app.use(handlePsqErrors)
app.use(handleCustomErrors)
app.use(handleServerErrors)
module.exports = app;