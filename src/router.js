const express = require('express'); //подключаем express
const db = require("./database.js");// бд

const router = express.Router(); // метод HTTP и присоединяемся  к экземпляру класса express.
// Создаем Роуты

//получить все статьи
router.get("/api/articles", (req, res, next) => {
    const sql = "select * from article";
    const params = [];
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(403).json({"error":err.message});
          return;
        }
        res.json({
            "message":"Успешно",
            "data":rows
        })
      });
});
//получить конкретную статью по id
router.get("/api/article/:id", (req, res, next) => {
    const sql = `select * from article where id = ${req.params.id}`;
    const params = [];
    // const sql = "select * from article where id = ?";
    // const params = [req.params.id];
    db.get(sql, params, (err, row) => {
        if (err) {
          res.status(403).json({"error":err.message});
          return;
        }
        console.log('row: ', row);
        res.json({
            "message":"Успешно",
            "data":row
        });
      });
});
// создать статью
router.post("/api/article/", (req, res, next) => {
    const errors=[];
    if (!req.body.title){
        errors.push("title обязательно");
    }
    if (!req.body.body){
        errors.push("body обязателен");
    }
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    const data = {
        title: req.body.title,
        body: req.body.body,
        date: req.body.date  // date : new Date()   
    };
    const sql ='INSERT INTO article (title, body, date) VALUES (?,?,?)';
    const params =[data.title, data.body, data.date];
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(403).json({"error": err.message});
            return;
        }
        res.json({
            "message": "Успешно",
            "data": data,
            "id" : this.lastID
        });
    });
});
//редактировать статью
router.put("/api/article/:id", (req, res, next) => {
    const data = {
        title: req.body.title,
        body: req.body.body
    };
    console.log(data);
    db.run(
        `UPDATE article set 
           title = COALESCE(?,title),
           body = COALESCE(?,body)
           WHERE id = ?`,
        [data.title, data.body, req.params.id],
        (err, result) => {
            if (err){
                console.log(err);
                res.status(403).json({"error": res.message});
                return;
            }
            res.json({
                message: "Успешно",
                data: data
            });
    });
});
//удалить статью по id
router.delete("/api/article/:id", (req, res, next) => {
    db.run(
        'DELETE FROM article WHERE id = ?',
        req.params.id,
        function (err, result) {
            if (err){
                res.status(403).json({"error": res.message});
                return;
            }
            res.json({"message":"Удалено", rows: this.changes});
    });
});

// Если никуда не попали
router.get("/", (req, res, next) => {
    res.json({"message":"Ok"});
});

module.exports = router;
