const { selectCommentsForArticle } = require('../models/comment.model');
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


