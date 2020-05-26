import mysql from "mysql";
import config from "../config";

const { database } = config;
const pool = mysql.createPool({
  host: database.HOST,
  user: database.USERNAME,
  password: database.PASSWORD,
  database: database.DATABASE,
});

const query = (sql) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
      } else {
        console.log("sql:", sql);
        connection.query(sql, (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
          connection.release();
        });
      }
    });
  });
};

export default {
  query,
};
