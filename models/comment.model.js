const db = require("../db/connection");

exports.selectCommentsForArticle = (article_id) => {
  const queryStr = `SELECT * FROM comments WHERE article_id =$1 ORDER BY created_at DESC;`
  return db.query(queryStr, [article_id]).then(({ rows }) => {
    return rows;
  }
  )
}
exports.addCommentsForArticle = (article_id, newComment) => {
  const {username, body} = newComment
  const queryStr =  `INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *; `;
  return db.query(queryStr, [username, body, article_id]).then(({ rows }) => {
    return rows[0]
  })
}

exports.checkCommentIdExists = (comment_id) => {
  const queryString = `SELECT * FROM comments WHERE comment_id = $1;`;
  return db.query(queryString, [comment_id]).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({status: 404, msg: `comment id ${comment_id} not found`,
      })}
      return rows;
    })
  }

exports.deleteCommentById = (comment_id) => {
  return db.query("DELETE FROM comments WHERE comment_id = $1;", [comment_id]);
};