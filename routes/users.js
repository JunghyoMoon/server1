var express = require("express");
var router = express.Router();
var db = require("../components/db");
const crypto = require("../components/crypto");
const users = require("../models/users");
const fs = require("fs");
/* GET users listing. */
router.get("/", async function (req, res, nexPt) {
  try {
    const { user_idx } = req.query;
    const connection = await db.getConnection();
    const results = await users.getList(connection, {
      user_idx: user_idx,
    });
    console.log("results : ", results); // results : [rowData {1,2,3,4...}]
    res.status(200).json({ results });
  } catch (err) {
    console.log("err : ", err);
    next();
  }
});

router.post("/signup", async function (req, res, next) {
  //{"user_info":[{},{}]}
  const body = req.body;
  console.log("body : ", body);
  try {
    const connection = await db.getConnection();
    //중복아이디체크
    await db.beginTransaction(connection);
    const userList = await users.getList(connection, {
      user_id: body.user_id, //[]의형태로 가져옴 -> 그냥규칙임 암기하셈
    });
    console.log("body.user_id : ", body.user_id);
    console.log("userList : ", userList);
    if (userList.length > 0) {
      //[]형태로옴
      return res.status(409).json({ errorMessage: "Duplicate user id" }); //return쓰면 여기서 종료되므로 굳이 else if 안써도됨
    }
    const { salt, encodedPw } = crypto.createPasswordPbkdf2(`${body.user_pwd}`);
    body.salt = salt;
    body.user_pwd = encodedPw;
    console.log("salt : ", salt);
    console.log("encodedPw : ", encodedPw);
    const result = await users.insert(connection, body);
    await db.commit(connection);
    res.status(200).json({ result });
  } catch (err) {
    // await db.rollback(connection);
    console.log("err : ", err);
    next();
  }
});

router.post("/signin", async function (req, res, next) {
  //{user_idx:??,user_pwd:??}
  const body = req.body;
  try {
    // 아이디와 pwd가 존재 할 때 true
    const connection = await db.getConnection();
    await db.beginTransaction(connection);
    const userList = await users.getList(connection, {
      user_id: body.user_id,
    }); // = [user]
    if (userList.length == 0) {
      return res.status(404).json({ errorMessage: "User not found" });
    }
    let user = userList[0];
    const encodedPw = crypto.getPasswordPbkdf2(body.user_pwd, user.salt);
    //encodedPw : 로그인시 입력한 비밀번호 + db에 저장된 salt -> 암호화
    if (user.user_pwd === encodedPw) {
      console.log("Authentication succeed");
    } else {
      return res.status(401).json({ errorMessage: "Authentication failed" });
    }
    delete user.user_pwd;
    delete user.salt;
    res.status(200).json({ login: true, result: user });
  } catch (err) {
    console.log("signin err : ", err);
    next();
  }
});

router.put("/", async function (req, res, next) {
  //{user_info:[{user_idx : ?,user_id : ?,user_pwd: ?}]}
  try {
    const { user_info } = req.body; // {user_idx :3, images:[]}
    const connection = await db.getConnection();
    await db.beginTransaction(connection);
    const results = await users.update(connection, {
      user_idx: user_info.user_idx,
      user_pwd: user_info.user_pwd,
    });
    await db.commit(connection);
    res.status(200).json({ results });
  } catch (err) {
    console.log("user upate err : ");
    next();
  }
});

router.delete("/", async function (req, res, next) {
  try {
    const body = req.body;
    const connection = await db.getConnection();
    await db.beginTransaction(connection);
    const results = await users.delete(connection, body);
    await db.commit(connection);
    res.status(200).json({ results });
  } catch (err) {
    await db.rollback();
    console.log("err : ", err);
    next();
  }
});

module.exports = router;
