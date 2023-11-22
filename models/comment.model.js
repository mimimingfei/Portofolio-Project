const db = require("../db/connection");

exports.selectCommentsForArticle = (article_id) => {
  const queryStr = `SELECT * FROM comments WHERE article_id =$1 ORDER BY created_at DESC;`
  return db.query(queryStr, [article_id]).then(({ rows }) => {
    return rows;
  }
  )
}
exports.addCommentsForArticle = (article_id, newComment) => {
  const {username, comment} = newComment
  const queryStr =  `INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *; `;
  return db.query(queryStr, [username, comment, article_id]).then(({ rows }) => {
    return rows[0]
  })
}
 