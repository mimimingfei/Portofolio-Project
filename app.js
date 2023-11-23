const express = require("express");
const {getAllTopics,getAllEndpoints,getArticleById,getAllArticles, updateArticle} = require("./controllers/article.controller")
const {getCommentsForArticle,postCommentForArticle} = require('./controllers/comment.controller')
const {handlePsqlErrors, handleCustomErrors, handleServerErrors, handle404} = require("./errors")
const{getAllUsers} = require('./controllers/user.controller')
const app = express();
app.use(express.json())

app.get('/api/topics', getAllTopics);
app.get('/api', getAllEndpoints);
app.get('/api/articles/:article_id',getArticleById)
app.get('/api/articles/:article_id/comments',getCommentsForArticle)
app.get('/api/articles',getAllArticles)

app.get('/api/users',getAllUsers)



app.post('/api/articles/:article_id/comments', postCommentForArticle)
app.patch('/api/articles/:article_id',updateArticle)


app.use(handle404)
app.use(handlePsqlErrors)
app.use(handleCustomErrors)
app.use(handleServerErrors)
module.exports = app;