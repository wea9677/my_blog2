const mongoose = require('mongoose');

const articleSchma = new mongoose.Schema({
    title : String,
    content : String,
    authorId : String,
    articlePw : String

},
{ timestamps: true }

);

articleSchma.virtual('articleId').get(function () {
    return this._id.toHexString();
});

articleSchma.set('toJSON', {
    virtuals: true,
});

module.exports = mongoose.model('Article', articleSchma);