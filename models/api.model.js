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

