const { selectTopics, selectArticleById } = require('../models/api.model.js')

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

exports.getArticleById = (req, res, next)=>{
    const { article_id } = req.params; 
    selectArticleById(article_id)
    .then((article) => {
        res.status(200).send(article);
    })
    .catch(next);
}