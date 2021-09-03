var express = require("express");
var router = express.Router();
const articles = require("../models/articles");
const category = require("../models/category");
const post_img = require("../models/post_img");
const db = require("../components/db");

router.get("/", async function (req, res, next) {
  try {
    const { articles_idx } = req.query;
    const connection = await db.getConnection();
    const results = await articles.getList(connection, {
      articles_idx: articles_idx,
    }); //a query

    //article get할시 같이 나오는 것들
    for (let i = 0; i < results.length; i++) {
      const categoryResult = await category.getList(connection, {
        articles_idx: results[i].articles_idx,
      });
      results[i].category = categoryResult;
      const ImgResult = await post_img.getList(connection, {
        articles_idx: results[i].articles_idx,
      });
      results[i].Img = ImgResult;
    }

    res.status(200).json({ results });
  } catch (err) {
    console.log("articles get error : ", err);
    next();
  }
});

router.get("/detail", async function (req, res, next) {
  try {
    const { articles_idx } = req.query;
    const connection = await db.getConnection();
    const results = await articles.detailgetList(connection, {
      articles_idx: articles_idx,
      content: body.content,
    }); //a query

    // //article get할시 같이 나오는 것들
    // for (let i = 0; i < results.length; i++) {
    //   const categoryResult = await category.getList(connection, {
    //     articles_idx: results[i].articles_idx,
    //   });
    // }

    res.status(200).json({ results });
  } catch (err) {
    console.log("articles get error : ", err);
    next();
  }
});

router.post("/", async function (req, res, next) {
  const body = req.body; // {name:asdf,price:200}
  try {
    const connection = await db.getConnection();
    await db.beginTransaction(connection);
    const articleDate = util.getCurrentTime();
    const result = [];
    // for (let i = 0; i < body.length; i++) {
    //   const articleResult = await articles.insert(connection, {
    //     articles_idx: body[i].articles_idx,
    //     post_write: body[i].post_write,
    //     post_comment: body[i].post_comment,
    //     post_word : body[i].post_word,
    //     star = body[i].star,
    //     post_see = body[i].post_see,
    //     post_Date: articleDate,
    //     content : body.content
    //   });
    //   result.push(articleResult.insertId);
    // }

    const articleResult = await articles.insert(connection, {
      articles_idx: body.articles_idx,
      post_write: body.post_write,
      post_comment: body.post_comment,
      post_word: body.post_word,
      post_Date: articleDate,
      content: body.content,
      thumb_content: body.thumb_content,
    });
    result.push(articleResult.insertId);

    // const result = await articles.insert(connection, {});
    await db.commit(connection);
    res.status(200).json({ result });
  } catch (err) {
    next();
  }
});

router.router.put("/post_see", async function (req, res, next) {
  try {
    const body = req.body;
    const connection = await db.getConnection();
    await db.beginTransaction(connection);
    const result = await articles.update(connection, body);
    await db.commit(connection);
    res.status(200).json({ result });
  } catch (err) {
    next();
  }
});
//집계함수(mysql,group by)
router.post("/star_add", async function (req, res, next) {
  try {
    const body = req.body;
    const connection = await db.getConnection();
    await db.beginTransaction(connection);
    const result = await articles.update(connection, body);
    await db.commit(connection);
    res.status(200).json({ result });
  } catch (err) {
    next();
  }
});

router.put("/count", async function (req, res, next) {
  try {
    const body = req.body;
    const connection = await db.getConnection();
    await db.beginTransaction(connection);
    const result = await articles.update(connection, body);
    await db.commit(connection);
    res.status(200).json({ result });
  } catch (err) {
    next();
  }
});

router.delete("/", async function (req, res, next) {
  try {
    const body = req.body;
    const connection = await db.getConnection();
    await db.beginTransaction(connection);
    const result = await articles.delete(connection, body);
    await db.commit(connection);
    res.status(200).json({ result });
  } catch (err) {
    next();
  }
});

module.exports = router;
