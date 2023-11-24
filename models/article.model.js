const db = require("../db/connection");

exports.selectTopics = () => {
    return db.query(`SELECT * FROM topics`)
    .then((data)=>{
        return data.rows
    })
}

exports.selectArticleById = (id)=>{
    const queryStr = `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.body, articles.created_at, articles.votes, articles.article_img_url, 
    CAST(COUNT(comments.article_id) AS INT) AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id
    `
    return db.query(queryStr, [id])
    .then(({rows})=>{
        if(rows.length===0){
            return Promise.reject({status:404, msg:`article of id ${id} is not found`})
        }
        return rows[0]
    })
}

exports.selectAllArticles = (topicSlug) => {
    let queryStr = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes,articles.article_img_url,
    CAST(COUNT(comments.article_id) AS INT) AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id`;
    const values = [];
    if (topicSlug) {
        queryStr += ` WHERE articles.topic = $1`;
        values.push(topicSlug);
    }
    queryStr += ` GROUP BY articles.article_id
    ORDER BY created_at DESC`;
    return db.query(queryStr, values).then(({ rows }) => rows);
};

exports.selectCommentsByArticleId = (articleId) => {
return db.query(`SELECT comment_id, article_id FROM comments WHERE article_id = $1;`,[articleId])
    .then(({ rows }) => {
        if (rows.length===0) {
            return Promise.reject({ status: 404, msg: `No comments found for article ${articleId}` });
        } 
        return rows
    });
};

exports.patchArticle = (article_id, newVote)=>{
    const {inc_votes} = newVote
    return db.query(`UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`,[inc_votes,article_id])
    .then(({rows})=>{
        if(rows.length===0){
            return Promise.reject({status:404, msg:`update article fail`})
        }
        return rows[0]
    })
}
