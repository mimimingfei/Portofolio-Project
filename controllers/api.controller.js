const { selectTopics } = require('../models/api.model.js')

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
