# Project API Node
 **В Проекте реализован REST API с CRUD(Create, Read, Update, Delete)
 операциями для создания статей. У пользователя есть возможность:**
  
* получить все статьи
* получить конкретную статью по id
* создать статью
* отредактировать статью
* удалить статью.

# Проект состоит:
  
* База данных SQLite для хранения данных
* Веб-сервер Express.js для управления конечными точками, запросами и ответами API
* Базовый проект Node.js
#
 
 
 Чтобы начать проект Node.js и Express.js, создайте новую папку проекта . Затем создайте пустой проект NPM, используя команду:

  `npm init` 
  
 Команда npm запросит некоторую информацию о проекте. Не обязательно заполнять каждое поле.
 Наиболее важными являются:  package name и entry point.
 Нашей точкой входа будет файл с именем app.js
 >package name: (express) express-api
 >version: (1.0.0)  
 description: Express REST API  
 entry point: (index.js) app.js  
 test command:  
 git repository:  
 keywords:  
 author: Me  
 license: (ISC)  
 
Затем вам нужно установить некоторые базовые зависимости, которые нам нужны в этом проекте: 
 
 `npm install express`  
 `npm install sqlite3`  
 `npm install md5`  
 `npm install body-parser`  

Создадим каталог в корне с именем `src`. 

 #app.js
 Теперь напишем код в app.js с помощью Express.
  Express.js - это очень простая реализация для веб-сервера.  
>      const express = require("express");  
>      const bodyParser = require("body-parser");  
>      const router = require('./src/router.js');  
>
>      const app = express();  
>      const HTTP_PORT = 3000;  
>
>      app.use(bodyParser.urlencoded({ extended: false }));  
>      app.use(bodyParser.json());  
>
>      app.use('/', router);  
>
>      app.listen(HTTP_PORT, () => {  
>      console.log(\`Server running on port ${HTTP_PORT}\`);  
>      });  
 
 #Запуск веб-сервера
 Теперь мы можем добавить новую  запись `"start"` в наш `package.json` файл для запуска нашего сервера с помощью `npm run` команды:  
  > "scripts": {  
     "start": "node app.js",  
     "test": "echo "Error: no test specified" && exit 1"  
   },  
   
После того, мы можем запустить наш сервер с помощью команды:
 
 `npm start`
 
 Вы можете указать браузеру URL-адрес сервера, `http://localhost:3000/` чтобы увидеть первоначальный 
 результат (наш ответ сервера для корневой конечной точки `"/"`):  
 
Обратите внимание, что каждый раз, когда вы вносите изменения в свой сервер, 
вам необходимо остановить его (Ctrl + C), а затем снова запустить сервер с помощью `npm start`. 


 #Подключение базы данных
На данный момент у нас работает веб-сервер. Теперь нам нужна локальная база данных
 для хранения информации, которая будет использоваться REST API. 
 В этом случае мы используем локальную базу данных SQLite, используя sqlite3.
Переходим в `src` и создаем файл с именем `database.js`   

В новом файле database.js мы создадим соединение с основной базой данных и инициализацию базы данных:  

 >     const sqlite3 = require('sqlite3').verbose();  
 >     const DBSOURCE = "db.sqlite";  
 >  
 >     const db = new sqlite3.Database(DBSOURCE, (err) => {  
 >         if (err) {   
 >            console.error(err.message);  
 >           throw err;  
 >         }else{  
 >             console.log('Connected to the SQlite database.');  
 >             db.run(`CREATE TABLE article (  
 >                 id INTEGER PRIMARY KEY AUTOINCREMENT,  
 >                 title text,   
 >                 body text,   
 >                 date text  
 >            )`,  
 >            (err) => {  
 >            if (err) {  
 >                console.log('Table already created');  
 >            } else {  
 >                console.log('Table just created');  
 >            }  
 >           });  
 >         }  
 >       });  
 >
 >     module.exports = db;  
 

 
 # REST API
 
 В Каталоге `src` создадим файл `router.js` и напишем следующий код 
 
 >     const express = require('express');
 >     const db = require("./database.js");
 >
 >     const router = express.Router();
 >     //получить все статьи
 >     router.get("/api/articles", (req, res, next) => {
 >     const sql = "select * from article";
 >     const params = [];
 >         db.all(sql, params, (err, rows) => {
 >             if (err) {
 >               res.status(403).json({"error":err.message});
 >               return;
 >              }
 >             res.json({
 >                 "message":"Успешно",
 >                 "data":rows
 >             })
 >            });
 >     });
 >      //получить конкретную статью по id
 >     router.get("/api/article/:id", (req, res, next) => {
 >         const sql = `select * from article where id = ${req.params.id}`;
 >         const params = [];
 >         db.get(sql, params, (err, row) => {
 >             if (err) {
 >                res.status(403).json({"error":err.message});
 >                return;
 >              }
 >              console.log('row: ', row);
 >              res.json({
 >                  "message":"Успешно",
 >                  "data":row
 >               });
 >            });
 >       });
 >       // создать статью
 >       router.post("/api/article/", (req, res, next) => {
 >           const errors=[];
 >           if (!req.body.title){
 >                errors.push("title обязательно");
 >            }
 >         if (!req.body.body){
 >             errors.push("body обязателен");
 >          }
 >          if (errors.length){
 >              res.status(400).json({"error":errors.join(",")});
 >              return;
 >          }
 >          const data = {
 >              title: req.body.title,
 >              body: req.body.body,
 >              date: req.body.date
 >         };
 >          const sql ='INSERT INTO article (title, body, date) VALUES (?,?,?)';
 >          const params =[data.title, data.body, data.date];
 >          db.run(sql, params, function (err, result) {
 >              if (err){
 >                  res.status(403).json({"error": err.message});
 >                  return;
 >              }
 >              res.json({
 >                  "message": "Успешно",
 >                  "data": data,
 >                  "id" : this.lastID
 >              });
 >          });
 >      });
 >      //редактировать статью
 >      router.put("/api/article/:id", (req, res, next) => {
 >          const data = {
 >              title: req.body.title,
 >              body: req.body.body
 >         };
 >          console.log(data);
 >         db.run(
 >              `UPDATE article set 
 >                 title = COALESCE(?,title),
 >                 body = COALESCE(?,body)
 >                 WHERE id = ?`,
 >              [data.title, data.body, req.params.id],
 >              (err, result) => {
 >                  if (err){
 >                      console.log(err);
 >                      res.status(403).json({"error": res.message});
 >                      return;
 >                  }
 >                  res.json({
 >                      message: "Успешно",
 >                      data: data
 >                  });
 >          });
 >      });
 >      //удалить статью по id
 >      router.delete("/api/article/:id", (req, res, next) => {
 >          db.run(
 >              'DELETE FROM article WHERE id = ?',
 >              req.params.id,
 >              function (err, result) {
 >                  if (err){
 >                      res.status(403).json({"error": res.message});
 >                      return;
 >                  }
 >                  res.json({"message":"Удалено", rows: this.changes});
 >          });
 >      });
 >      
 >      // Если никуда не попали
 >      router.get("/", (req, res, next) => {
 >          res.json({"message":"Ok"});
 >      });
 >     
 >      module.exports = router;


Ответы приходят на все запросы . Не совсем корректны, так как не рассмотрены различные случаи.
Обычно для обработки ошибок используется конструкция try catch
REpresentational State Transfer это архитектура, т.е. принципы построения распределенных гипермедиа систем, того что другими словами называется World Wide Web, включая универсальные способы обработки и передачи состояний ресурсов по HTTP
Коды сгруппированы в 5 классов: информационные, успешные, перенаправления, ошибки клиента и ошибки сервера. Для организации кода 
Отдельно,   роуты, контроллеры … если ребят надо добавил бы комментарии.. 
Защититься нужно , фильтруя данные. Это повысит безопасность , + можно использовать passport, passport-jwt. 
Так же при создании статьи присваивать лучше id  например =>("ng4dP3E26fUuHuvElcsAzaoMmxm9fv")
И дату присваивать лучше date: new Date()
