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