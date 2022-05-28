const autoIdSetter = require('./auto-id-setter');
const mongoose = require("mongoose");

const articleSchma = new mongoose.Schema({

    // articleId: {
    //     type: String,           //아직 수정을 못했습니다 자료를 더 찾아보고 바꿔보도록 하겠습니다. 
    //     required : true,
    //     unique:true
    // },
    name: {
        type:String,
        required:true
    },
    articlePw:{
        type:String,
        required:true
    },
    // date: {
    //     type:Date,
    //     required:true
    // },
    title: {
        type:String,
        required:true
    },
    content: {
        type:String,
        required:true
    }


},

{ timestamps: true }
);
autoIdSetter(articleSchma, mongoose, 'article', 'articleId'); 
module.exports = mongoose.model("Article", articleSchma);