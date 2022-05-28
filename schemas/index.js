const mongoose = require("mongoose");

const connect = () => {
    // mongoose.connect("mongodb+srv://wea9677:tmxkdlfl@cluster0.xmzro.mongodb.net/article_database?retryWrites=true&w=majority").catch((err) =>{
    //     console.error(err);
  

 // EC2 ubuntu 의 경우
        mongoose.connect("mongodb://0.0.0.0:27017/article_database",
            { ignoreUndefined: true }).catch((err) => {
        console.error(err)
    
    }); 

};

module.exports = connect;

