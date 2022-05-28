const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    authorName: String,
    pw: String,

});

UserSchema.virtual("authorId").get(function () {
    return this._id.toHexString();
});
UserSchema.set("toJSON" , {
    virtuals:true,
});

module.exports = mongoose.model("User", UserSchema);