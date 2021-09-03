const mysql = require("mysql");

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "127.0.0.1",
  user: "root",
  password: "gksdml852!",
  database: "pot",
});

module.exports.getConnection = () => {
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) {
        reject(err);
      }
      resolve(connection);
    });
  });
};
module.exports.beginTransaction = (connection) => {
  return new Promise((resolve, reject) => {
    connection.beginTransaction(function (err) {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
};

module.exports.commit = (connection) => {
  return new Promise((resolve, reject) => {
    connection.commit(function (err) {
      if (err) reject(this.rollback(connection));
      else {
        connection.release();
        resolve();
      }
    });
  });
};

module.exports.rollback = (connection) => {
  return new Promise((resolve, reject) => {
    connection.rollback((err) => {
      if (err) reject(err);
      else {
        connection.release();
        resolve();
      }
    });
  });
};

module.exports.query = (connection, options) => {
  return new Promise((resolve, reject) => {
    connection.query(
      options.query,
      options.values,
      function (error, results, fields) {
        if (error) {
          reject(error);
        }
        resolve(results);
      }
    );
  });
};
