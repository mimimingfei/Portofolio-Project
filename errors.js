exports.handlePsqErrors = (err, req, res, next) =>{
    if(err.code === "22P02" || err.code === "23502") {
        res.status(400).send({msg: "bad request"});
    } else {
        next(err)
    }
}

exports.handleCustomErrors = (err, req, res, next) => {
    if (err.status && err.msg) {
      res.status(err.status).send({ msg: err.msg });
    } else next(err);
  }

exports.handleServerErrors = (err, req, res, next) =>{
    console.log(err);
    res.status(500).send({msg : "internal server error"})
} 

exports.handle404 = (req, res) =>{
    console.log('handle404 invoked')
    res.status(404).send({ msg:'not found'});
  }