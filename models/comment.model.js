const db = require("../db/connection");

exports.selectCommentsForArticle=(article_id)=>{
    const queryStr = `SELECT * FROM comments WHERE article_id =$1 ORDER BY created_at DESC;`
    return db.query(queryStr, [article_id]).then(({ rows }) => {
        console.log(rows)
        if (!rows.length) {
          return Promise.reject({ status: 404, msg: `no comments found for article ${article_id}` });
        } else {
          return rows;
        }
      });
    };