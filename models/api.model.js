const {Pool}= require('pg')
const db = new Pool()

exports.selectTopics = () => {
    return db.query(`SELECT * FROM topics`)
    .then((data)=>{
        return data.rows
    })
}

