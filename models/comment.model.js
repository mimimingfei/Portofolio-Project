const db = require("../db/connection");

exports.selectCommentsForArticle = (article_id) => {
  const queryStr = `SELECT * FROM comments WHERE article_id =$1 ORDER BY created_at DESC;`
  return db.query(queryStr, [article_id]).then(({ rows }) => {
    return rows;
  }
  )
}