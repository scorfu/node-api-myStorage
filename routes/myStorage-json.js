var express = require("express");
var router = express.Router();
var fs = require("fs");

const DATA_PATH = "data/list.json";

/**
 * IMPORTANT: add content type headers to be able to use req.body.*
  headers: {"Content-Type": "application/json"},
 */

/**
 *
 */
router.get("/", function (req, res, next) {
  const content = fs.readFileSync(DATA_PATH);
  const objects = JSON.parse(content);
  res.json(objects);
});

/**
 *
 */
router.post("/create", function (req, res, next) {
  const nameObj = req.body.nameObj;
  const category = req.body.category;
  const depositArea = req.body.depositArea;
  const depositDate = req.body.depositDate;

  let content = fs.readFileSync(DATA_PATH);
  const objects = JSON.parse(content);

  const id = Math.random().toString(36).substring(7) + new Date().getTime();

  objects.push({
    id,
    nameObj,
    category,
    depositArea,
    depositDate
  });

  content = JSON.stringify(objects, null, 2);
  fs.writeFileSync(DATA_PATH, content);

  res.json({ success: true, id });
});

/**
 *
 */
router.delete("/delete", function (req, res, next) {
  const id = req.body.id;

  let content = fs.readFileSync(DATA_PATH);
  const objects = JSON.parse(content);

  const remainingObjects = objects.filter(function (object) {
    return object.id != id;
  });

  content = JSON.stringify(remainingObjects, null, 2);
  fs.writeFileSync(DATA_PATH, content);

  res.json({ success: true });
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

  let content = fs.readFileSync(DATA_PATH);
  const objects = JSON.parse(content);

  const contact = objects.find(function (object) {
    return object.id == id;
  });
  if (contact) {
    contact.nameObj = nameObj;
    contact.category = category;
    contact.depositArea = depositArea;
    contact.depositDate = depositDate;
  }

  content = JSON.stringify(objects, null, 2);
  fs.writeFileSync(DATA_PATH, content);

  res.json({ success: true });
});

module.exports = router;
