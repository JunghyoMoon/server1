const db = require("../components/db");

module.exports.getList = async (
  connection, // PoolConnection
  options // {idx, name}
) => {
  let query = `SELECT * FROM category
              LEFT JOIN articles ON category.category_idx = articles.category_idx`;
  let values = [];
  if (options) {
    if (options.articles_idx) {
      query += " WHERE articles_idx = ?";
      values.push(options.articles_idx);
    }
  }
  return await db.query(connection, {
    query: query,
    values: values,
  });
};

module.exports.insert = async (connection, options) => {
  let query = `INSERT INTO category SET ?`;
  let values = options;
  return await db.query(connection, {
    query: query,
    values: values,
  });
};

module.exports.update = async (connection, options) => {
  let query = `UPDATE category SET ?`;
  let values = [options];
  if (options) {
    if (options.articles_idx) {
      query += " WHERE articles_idx = ?";
      values.push(options.articles_idx);
    }
  }
  // UPDATE category SET ? WHERE user_idx = ?
  return await db.query(connection, {
    query: query,
    values: values,
  });
};

module.exports.delete = async (connection, options) => {
  let query = `DELETE FROM category`;
  let values = [];
  if (options) {
    if (options.articles_idx) {
      query += " WHERE articles_idx = ?";
      values.push(options.brand_idx);
    }
  }
  return await db.query(connection, {
    query: query,
    values: values,
  });
};
