const articles = require('../db/data/test-data/articles.js');
const { selectTopics, selectArticleById, selectAllArticles, selectCommentsByArticleId } = require('../models/article.model.js')


exports.getAllTopics = (req, res, next) => {
    selectTopics()
        .then((topics) => {
            res.status(200).send(topics);
        })
        .catch(next);
};

exports.getAllEndpoints = (req, res, next) => {
    const endpoints = require("../endpoints.json");
    res.status(200).send({ endpoints });
}

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    selectArticleById(article_id).then((article) => {
        res.status(200).send({ article });
    })
        .catch(next)
}

exports.getAllArticles = (req, res, next) => {
    selectAllArticles()
        .then((articles) => {
            return res.status(200).send({ articles });
        })
        .catch(next);
};

exports.updateArticle = ()=>{}

// /api/articles/:article_id.
// update an article by article_id.
// Request body accepts:

// an object in the form { inc_votes: newVote }.
// newVote will indicate how much the votes property in the database should be updated by, e.g.
// { inc_votes : 1 } would increment the current article's vote property by 1
// { inc_votes : -100 } would decrement the current article's vote property by 100