const db = require("../components/db");

module.exports.getList = async (
  connection, // PoolConnection
  options // {idx, name}
) => {
  let query = `SELECT * FROM search
              LEFT JOIN articles ON search.articles_idx = articles.articles_idx`;
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
  let query = `INSERT INTO search SET ?`;
  let values = options;
  return await db.query(connection, {
    query: query,
    values: values,
  });
};

module.exports.update = async (connection, options) => {
  let query = `UPDATE search SET ?`;
  let values = [options];
  if (options) {
    if (options.articles_idx) {
      query += " WHERE articles_idx = ?";
      values.push(options.articles_idx);
    }
  }
  // UPDATE search SET ? WHERE user_idx = ?
  return await db.query(connection, {
    query: query,
    values: values,
  });
};

module.exports.delete = async (connection, options) => {
  let query = `DELETE FROM search`;
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
