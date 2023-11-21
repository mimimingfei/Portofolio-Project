const {Pool}= require('pg')
const db = new Pool()

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

exports.selectAllArticles = () => {
    const queryStr = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes,
    CAST(COUNT(comments.article_id) AS INT) AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    GROUP BY comments.article_id, articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes
    ORDER BY created_at DESC
    `;
    return db.query(queryStr).then(({ rows }) => {
      return rows;
    });
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
