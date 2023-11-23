const db = require("../db/connection");

exports.selectTopics = () => {
    return db.query(`SELECT * FROM topics`)
    .then((data)=>{
        return data.rows
    })
}

exports.selectArticleById = (id)=>{
    return db.query(`SELECT * FROM articles WHERE article_id = $1;`,[id])
    .then(({rows})=>{
        if(rows.length===0){
            return Promise.reject({status:404, msg:`article of id ${id} is not found`})
        }
        return rows[0]
    })
}

exports.selectAllArticles = (topic) => {
    let queryStr = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes,
    CAST(COUNT(comments.article_id) AS INT) AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id`;
    const value = [];
    if (topic) {
      queryStr += ` WHERE articles.topic = $1`;
      value.push(topic);
  }
    queryStr += ` GROUP BY articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes
ORDER BY created_at DESC`;

    console.log(queryStr)
    return db.query(queryStr,value).then(({ rows }) => {
        return rows;
      });
    }

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
