const mongoose = require('mongoose');

const articleSchema = mongoose.Schema(
    {
        title: String,
        content: String,
        authorId: String,
        articlePassword: String,
    },
    { timestamps: true }
);

articleSchema.virtual('articleId').get(function () { 
    return this._id.toHexString();
});

articleSchema.set('toJSON', {
    virtuals: true,
});

module.exports = mongoose.model('Article', articleSchema);