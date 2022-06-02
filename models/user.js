const mongoose = require('mongoose');

const UserSchema = mongoose.Schema(
    {
        authorName: String,
        password: String,
    },
    { timestamps: true }
);
UserSchema.virtual('authorId').get(function () { // 여기서 사용한 authorId 값은 회원 고유값인 동시에 게시글 닉네임이 된다.
    return this._id.toHexString();
});
UserSchema.set('toJSON', {
    virtuals: true,
});

module.exports = mongoose.model('User', UserSchema);