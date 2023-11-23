const { selectCommentsForArticle,addCommentsForArticle, checkCommentIdExists,deleteCommentById} = require('../models/comment.model');
const { selectArticleById } = require('../models/article.model')
exports.getCommentsForArticle = (req, res, next) => {
    const { article_id } = req.params;
    const ifArticleExists = selectArticleById(article_id);
    const commentsFromArticle = selectCommentsForArticle(article_id)
    Promise.all([ifArticleExists, commentsFromArticle])
        .then(([article, comments]) => {
            res.status(200).send({ comments });
        })
        .catch(next)
}

exports.postCommentForArticle = (req, res, next)=>{
    const { article_id } = req.params;
    const newComment = req.body;
    const ifArticleExists = selectArticleById(article_id);
    const postComment = addCommentsForArticle (article_id, newComment)
    Promise.all([ifArticleExists, postComment])
    .then(([article, Comment]) => {
        return res.status(201).send({ Comment });
      })
      .catch(next);
  };


exports.deleteComment = (req, res, next) => {
    const { comment_id } = req.params;
    checkCommentIdExists(comment_id).then(() => {
        return deleteCommentById(comment_id);
      })
      .then(() => {
        return res.status(204).send();
      })
      .catch(next);
  };