const express = require("express");
const connect = require("./schemas");
const app = express();
const port = 3000;

connect();

const articleRouter = require("./routes/article")

const requestMiddleware = (req, res, next) => {
    console.log("Request URL:", req.originalUrl, " - ", new Date());
    next();
};
// 데이터 파싱 미들웨어
app.use(express.json());

app.use(requestMiddleware);

app.use("/api", [articleRouter]);

app.get("/", (req, res) =>{
    res.send("hello world")
    // res.sendFile(__dirname + "/index.html")
});

// app.get("/article", (req, res) =>{
//     res.sendFile(__dirname + "/article.html")
// });

app.listen(port, () => {
    console.log(port, "포트로 서버가 켜졌어요!");
});