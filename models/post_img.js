const db = require("../components/db");

module.exports.getList = async (
  connection, // PoolConnection
  options // {idx, name}
) => {
  let query = `SELECT * FROM post_img`;
  let values = [];
  if (options) {
    if (options.img_idx) {
      query += " WHERE img_idx = ?";
      values.push(options.img_idx);
    }
  }
  return await db.query(connection, {
    query: query,
    values: values,
  });
};

module.exports.insert = async (connection, options) => {
  let query = `INSERT INTO post_img SET ?`;
  let values = options;
  return await db.query(connection, {
    query: query,
    values: values,
  });
};

module.exports.update = async (connection, options) => {
  let query = `UPDATE post_img SET ?`;
  let values = [options];
  if (options) {
    if (options.img_idx) {
      query += " WHERE img_idx = ?";
      values.push(options.img_idx);
    }
  }
  // UPDATE post_img SET ? WHERE user_idx = ?
  return await db.query(connection, {
    query: query,
    values: values,
  });
};

module.exports.delete = async (connection, options) => {
  let query = `DELETE FROM post_img`;
  let values = [];
  if (options) {
    if (options.img_idx) {
      query += " WHERE img_idx = ?";
      values.push(options.img_idx);
    }
  }
  return await db.query(connection, {
    query: query,
    values: values,
  });
};
