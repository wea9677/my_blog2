const express = require("express");
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const User = require("./models/users");
const Article = require("./models/article");
const Comment = require("./models/comment")
const Joi = require('joi');
// const connect = require("./schemas");
const app = express();
const port = 8080;
const router = express.Router();

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

// app.get("/article", (req, res) =>{
//     res.sendFile(__dirname + "/article.html")
// });

//글 쓰기 파트

// router.post("/article/write", async (req, res) => {
 
// });






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



router.post("/users", async (req, res) =>{

    const {authorName, pw, confirmPassword} = await postUserSchema.validateAsync(req.body);

    if (pw.includes(authorName)) {
        res.status(400).send({
            errorMessage:
                '비밀번호에 사용자의 아이디는 포함할 수 없습니다.',
        });
        return; // 이 코드 이하의 코드를 실행하지 않고 탈출
    }

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

    res.status(201).json({users : user })

   
  
   
});


app.listen(port, () => {
    console.log(port, "포트로 서버가 켜졌어요!");
});