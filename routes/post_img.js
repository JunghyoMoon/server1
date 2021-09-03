var express = require("express");
var router = express.Router();
const post_img = require("../models/post_img");
const formidable = require("formidable");
const db = require("../components/db");
const fs = require("fs");
const path = require("path");
// router.get("/", async function (req, res, next) {
//   try {
//     const { img_idx } = req.query;
//     const connection = await db.getConnection();
//     const results = await post_img.getList(connection, {
//       img_idx: img_idx,
//     }); //a query
//     res.status(200).json({ results });
//   } catch (err) {
//     console.log("post_img get error : ", err);
//     next();
//   }
// });
//사진 업로드
router.post("/upload", async function (req, res, next) {
  //{form-data로보냄}
  // const body = req.body;
  try {
    const { post_idx } = req.query;
    const form = formidable({ multiples: true });
    form.parse(req, (err, fields, files) => {
      if (err) {
        return res.json({ result: "upload fail" });
      }
      console.log("files : ", files);
      const keys = Object.keys(files);
      const result = [];
      for (let i = 0; i < keys.length; i++) {
        const file = files[keys[i]];
        const dir = `public/images`;
        !fs.existsSync(dir) && fs.mkdirSync(dir);
        const subDir = `${dir}/${post_idx}`;
        !fs.existsSync(subDir) && fs.mkdirSync(subDir);
        const newPath = path.join(__dirname, "..", `${subDir}/${file.name}`);
        //join은절대경로
        fs.renameSync(file.path, newPath); //경로를 바꿔줍니다
        result.push(`images/${post_idx}/${file.name}`);
      }
      res.json({ result });
    });
  } catch (err) {
    console.log("err : ", err);
    next();
  }
});

//db주소 전달
router.post("/", async function (req, res, next) {
  const { post_idx, img_path } = req.body; // {post_idx,img_path}
  try {
    const connection = await db.getConnection();
    await db.beginTransaction(connection);
    const postImgArray = [];

    const results = await post_img.insert(connection, {
      post_idx: post_idx,
      img_path: img_path,
    });
    postImgArray.push(results.insertId);

    await db.commit(connection);
    res.status(200).json({ results: postImgArray });
  } catch (err) {
    // await db.rollback(connection);
    console.log("err : ", err);
    next();
  }
});

router.put("/upload", async function (req, res, next) {
  try {
    const { imgPath } = req.query;
    const form = formidable({ multiples: true });

    form.parse(req, (err, fields, files) => {
      if (err) {
        return res.json({ result: "upload fail" });
      }
      const file = files.image;
      const dir = `public/${imgPath}`;
      console.log("imgPath : ", imgPath);
      const newPath = path.join(__dirname, "..", `${dir}`);
      fs.renameSync(file.path, newPath); //경로를 바꿔줍니다.
      res.json({ result: true });
    });
  } catch (err) {
    console.log("err : ", err);
    next(err);
  }
});

router.delete("/", async function (req, res, next) {
  try {
    const body = req.body;
    const connection = await db.getConnection();
    await db.beginTransaction(connection);
    const result = await post_img.delete(connection, body);
    await db.commit(connection);
    res.status(200).json({ result });
  } catch (err) {
    next();
  }
});

module.exports = router;
