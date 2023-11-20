const {selectTopics} = require('../models/api.model.js')

exports.getAllTopics = (req, res, next) => {
        selectTopics()
            .then((topics) => {
                res.status(200).send(topics.rows);
            })
            .catch(next);
    };