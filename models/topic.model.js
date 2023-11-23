const db = require("../db/connection");

exports.checkTopicExist = (topic) => {
    if (!topic) return Promise.resolve(null);

    const queryString = `SELECT slug FROM topics WHERE slug = $1;`;
    return db.query(queryString, [topic]).then(({ rows }) => {
        if (!rows.length) {
            return Promise.reject({ status: 404, msg: `topic ${topic} not found` });
        }
        return rows[0];
    });
};