const {Pool}= require('pg')
const db = new Pool()

exports.selectTopics = () => {
    return db.query(`SELECT * FROM topics`)
    .then((data)=>{
        return data.rows
    })
}

exports.selectArticleById = (id)=>{
    const isNumberRegex = /^\d+$/;
    if (!isNumberRegex.test(id)) {
        return Promise.reject({ status: 400, msg: 'invalid id' });
    }
    return db.query(`SELECT * FROM articles WHERE article_id = $1;`,[id])
    .then(({rows})=>{
        if(!rows.length){
            return Promise.reject({status:404, msg:'not found'})
        }
        return rows[0]
    })
}
exports.selectAllArticles=()=>{
    const promise1 = db.query(`SELECT * FROM articles`)
    const promise2 = promise1.forEach(element => {
         selectCommentsByArticleId(element.article_id)
    });
    return Promise.all([promise1, promise2])
    .then(([articles, comments]) => {
        return { articles: articles.rows, comments };
    });
}

exports.selectCommentsByArticleId = (articleId) => {
    const query = `SELECT comment_id, article_id FROM comments WHERE article_id = $1;`;
    return db.query(query, [articleId])
        .then(({ rows }) => {
            if (!rows.length) {
                return Promise.reject({ status: 404, msg: 'No comments found' });
            } 
            return rows.length;
        });
};
