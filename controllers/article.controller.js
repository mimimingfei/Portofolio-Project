const articles = require('../db/data/test-data/articles.js');
const { selectTopics, selectArticleById, selectAllArticles, patchArticle } = require('../models/article.model.js')


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


exports.updateArticle = (req, res, next) =>{
    const { article_id } = req.params;
    const newVote = req.body;
    selectArticleById(article_id).then((article)=>{
        return patchArticle(article.article_id, newVote)
    })
   .then((updatedArticle)=>{
        return res.status(200).send({updatedArticle})
    })
    .catch(next);
}



