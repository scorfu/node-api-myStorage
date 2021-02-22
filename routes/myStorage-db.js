var express = require("express");
var router = express.Router();
var mysql = require("mysql");

/**
 * IMPORTANT: add content type headers to be able to use req.body.*
  headers: {"Content-Type": "application/json"},
 */

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "myStorage"
});

/**
 * run this before first USAGE to create myStorage TABLE
 */
router.get("/install", function (req, res, next) {
  pool.getConnection(function (err, connection) {
    if (err) throw err;
    const sql = `
    CREATE TABLE IF NOT EXISTS myStorage (id INT NOT NULL AUTO_INCREMENT, nameObj TEXT NOT NULL, category TEXT NOT NULL, depositArea TEXT NOT NULL, depositDate DATE NOT NULL, PRIMARY KEY (id)) ENGINE = InnoDB;
    `;
    connection.query(sql, function (err, results) {
      if (err) throw err;
      connection.release();
      res.redirect("/");
    });
  });
});

/**
 *
 */
router.get("/", function (req, res, next) {
  pool.getConnection(function (err, connection) {
    if (err) throw err;
    const sql = `SELECT id, nameObj, category, depositArea, DATE_FORMAT(depositDate, "%Y-%m-%d") as depositDate FROM myStorage`;
    connection.query(sql, function (err, results) {
      if (err) throw err;
      connection.release();
      res.json(results);
    });
  });
});

/**
 *
 */
router.post("/create", function (req, res, next) {
  const nameObj = req.body.nameObj;
  const category = req.body.category;
  const depositArea = req.body.depositArea;
  const depositDate = req.body.depositDate;

  pool.getConnection(function (err, connection) {
    if (err) throw err;
    const sql = `INSERT INTO myStorage (id, nameObj, category, depositArea, depositDate) VALUES (NULL, ?, ?, ?, ?);`;
    connection.query(sql, [nameObj, category, depositArea, depositDate], function (err, results) {
      if (err) throw err;
      const id = results.insertId;
      connection.release();
      res.json({
        success: true,
        id
      });
    });
  });
});

/**
 *
 */
router.delete("/delete", function (req, res, next) {
  const id = req.body.id;

  pool.getConnection(function (err, connection) {
    if (err) throw err;
    const sql = `DELETE FROM myStorage WHERE id=?`;
    connection.query(sql, [id], function (err, results) {
      if (err) throw err;
      connection.release();
      res.json({ success: true });
    });
  });
});

/**
 *
 */
router.put("/update", function (req, res, next) {
  const id = req.body.id;
  const nameObj = req.body.nameObj;
  const category = req.body.category;
  const depositArea = req.body.depositArea;
  const depositDate = req.body.depositDate;

  pool.getConnection(function (err, connection) {
    if (err) throw err;
    const sql = `UPDATE myStorage SET nameObj=?, category=?, depositArea=?, depositDate=? WHERE id=?`;
    connection.query(sql, [nameObj, category, depositArea, depositDate, id], function (err, results) {
      if (err) throw err;
      connection.release();
      res.json({ success: true });
    });
  });
});

module.exports = router;
