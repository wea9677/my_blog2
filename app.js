const express = require("express");
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const User = require("./models/users");
const Article = require("./models/article");
const Comment = require("./models/comment")
const Joi = require('joi');
// const connect = require("./schemas");
const router = express.Router();
const app = express();
const port = 8080;


// 로컬에서 테스트 중인 경우
mongoose.connect('mongodb://0.0.0.0/my_blog2', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Ubuntu EC2에서 테스트 중인 경우
// mongoose
//     .connect(process.env.AWS_MONGO_DB, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//         ignoreUndefined: true,
//     })
//     .catch((err) => {
//         console.error(err);
//     });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));




const requestMiddleware = (req, res, next) => {
    console.log("Request URL:", req.originalUrl, " - ", new Date());
    next();
};

// 데이터 파싱 미들웨어
app.use(express.json());

app.use(requestMiddleware);



app.get("/", (req, res) =>{
    res.send("hello world")
    // res.sendFile(__dirname + "/index.html")
});

//  app.get("/article", (req, res) =>{
// //     res.sendFile(__dirname + "/article.html")
//     res.send("테스트입니다.")
//  });

// // 전체 글 불러오기
//  router.get('/articles', async (req, res) => {
//     // [{ article의 내용. _id: ..., title: ..., content: ... }, { }, { }]
//     const articles = await Article.find().sort({ createdAt: 'desc' }).exec();
//     // authorId만 추출. ['authorId1', 'authorId2', 'authorId3', ..]
//     const authorIds = articles.map((author) => author.authorId);
//     // $in : 비교 연산자. 주어진 배열(authorIds) 안에 속하는 값
//     const authorInfoById = await User.find({
//         _id: { $in: authorIds },
//     })
//         .exec()
//         .then((author) => author.reduce((prev, a) => ({...prev,[a.authorId]: a,}),{}));
//     // console.log(authorInfoById); // { authorId1: { _id: .. , authorName: .. , password: .. ,}, authorId2: {}, .. }
//     res.send({
//         articles: articles.map((a) => ({
//             articleId: a.articleId,
//             title: a.title,
//             content: a.content,
//             createdAt: a.createdAt,
//             authorInfo: authorInfoById[a.authorId],
//         })),
//     });
// });



//글 쓰기 파트

app.post("/article/write", async (req, res) => {
    const { authorId, articlePw, title, content } = req.body;
    console.log(req.body);
    const createdArticle = await Article.create({authorId, articlePw, title, content,});
    res.json({ article: createdArticle });
    // res.status(201).json({ result: 'success', msg: '글이 등록되었습니다.' });
    

});

app.get("/article", async (req, res) => {

    const articles = await Article.find().sort({ createdAt: 'desc' }).exec();

    res.json({
        articles,
    });

    // const authorIds = articles.map((author) => author.authorId);

    // const authorInfoById = await User.find({_id: { $in: authorIds },}) .exec().then((author) =>author.reduce((prev, a) => ({...prev,[a.authorId]: a,}),{}));

    // res.send({
    //     articles: articles.map((a) => ({
    //         articleId: a.articleId,
    //         title: a.title,
    //         content: a.content,
    //         createdAt: a.createdAt,
    //         authorInfo: authorInfoById[a.authorId],
    //     })),
    // });


});







//************************************************************************************** */

//회원가입



const nickname_pattern = /[a-zA-Z0-9]/; // 닉네임은 알파벳 대소문자 (a~z, A~Z), 숫자(0~9)로 구성하기. flag는 미사용.
const postUserSchema = Joi.object({
    // email: Joi.string().pattern(new RegExp(email_pattern)).required(),
    authorName: Joi.string()
        .min(3)
        .pattern(new RegExp(nickname_pattern))
        .required(),
    password: Joi.string().min(4).required(),
    confirmPassword: Joi.string().required(),
});



app.post("/users", async (req, res) =>{

    const {authorName, pw, confirmPassword} = req.body;

    // if (pw.includes(authorName)) {
    //     res.status(400).send({
    //         errorMessage:
    //             '비밀번호에 사용자의 아이디는 포함할 수 없습니다.',
    //     });
    //     return; // 이 코드 이하의 코드를 실행하지 않고 탈출
    // }

    if (pw !== confirmPassword) {
        // 비밀번호, 비밀번호 확인 일치 여부 확인
        res.status(400).send({
            errorMessage:
                '비밀번호와 비밀번호 확인의 내용이 일치하지 않습니다.',
        });
        return; 
    }
    const existUsers = await User.find({
        $or: [{ authorName }],
    });
    if (existUsers.length) {
        // authorName 중복 데이터가 존재 할 경우
        res.status(400).send({
            errorMessage: '중복된 닉네임입니다.',
        });
        return;
    }
    const user = new User({ authorName, pw });
    await user.save();

    return res.status(201).json({
        success: true
    })

});


app.listen(port, () => {
    console.log(port, "포트로 서버가 켜졌어요!");
});