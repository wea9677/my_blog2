const express = require("express");
const Article = require("../schemas/article");
const UserSchema = require("../models/users");
const router = express.Router();




router.get("/", (req, res) => {
    res.send("this is root page")
    // res.sendFile(__dirname + "/index.html")
});


router.get("/article", async (req, res) => {
    const article = await Article.find().sort({createdAt:'desc'});

    res.json({
        article,
    });
    // res.sendFile(__dirname + "/article.html")
});




// 상세페이지

router.get("/article/:articleId", async (req, res) => {
    const { articleId } = req.params;

    const [article] = await Article.find({ articleId: Number(articleId) });

    res.json({
        detail: article
    });
});

// 삭제하기
router.delete("/article/:articleId", async (req, res) => {
    const {articlePw ,articleId} = req.params;
    
    const removearticle = await Article.find({articleId : Number(articleId)}); //비밀번호를 비교하는 법을 찾지 못했습니다. ㅠㅠ
                                                                               //그리고 Thunder client 에서 비밀번호 값을 어떻게 비교 해서 검사를 하는지 방법도 잘 모르겠어요 ㅠㅠ
    if (removearticle.length ) {
      if (removearticle[0].articlePw !== articlePw){ //글 지우기 전 입력받은 비밀번호 체크하기
        res.status(400).json({'result':'success', 'msg':'비밀번호가 일치하지 않습니다.'})
      } else {
        await Article.deleteOne({articleId: Number(articleId)});
        res.status(200).json({'result':'success', 'msg':'글이 삭제되었습니다.'})
      }
    }
    //res.json({success: true});
  });



  
// 수정하기  
  router.put("/article/:articleId", async (req, res) => {
    const {articleId} = req.params;
    const {content, name, title, articlePw} = req.body;

    const updatearticle = await Article.find({articleId : Number(articleId)});
    if (updatearticle.articlePw !== articlePw){
      res.status(400).json({'result': 'error', 'msg': '비밀번호가 일치하지 않아요..!'})

    }else{
      const updatearticle = await Article.updateOne({articleId: Number(articleId)}, {$set: {content, name, title, articlePw}});
      res.status(201).json({'result': 'success', 'msg': '글이 수정되었습니다.'})
    }
    
    

    //res.json({success: true});
  });




//기록하기

router.post("/article", async (req, res) => {
    const { name, articlePw, title, content } = req.body;
    console.log(req.body);
    // const article = await Article.find({ articleId });
    // if (article.length) {
    //     return res
    //     .status(400)
    //     .json({ success: false, errorMessage: "이미 있는 데이터입니다." });
    // }
    
    const createdArticle = await Article.create({name, articlePw, title, content });


    res.json({ article: createdArticle });
});

module.exports = router;