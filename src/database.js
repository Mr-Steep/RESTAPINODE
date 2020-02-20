const sqlite3 = require('sqlite3').verbose(); // создаем базу данных с несколькими колонками и устанаавливаем соединение
const DBSOURCE = "db.sqlite";

const db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      console.error(err.message);
      throw err;
    }else{
        console.log('Connected to the SQlite database.');
        db.run(`CREATE TABLE article (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title text, 
            body text, 
            date text
            )`,
            (err) => {
            if (err) {
                console.log('Table already created');
            } else {
                console.log('Table just created');
            }
        });
    }
});


module.exports = db;

