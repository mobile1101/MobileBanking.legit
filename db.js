const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbFile = path.join(__dirname, '..', 'db.sqlite');
const db = new sqlite3.Database(dbFile);
function run(sql, params=[]) {
  return new Promise((resolve,reject)=>{
    db.run(sql, params, function(err){
      if(err) reject(err); else resolve(this);
    });
  });
}
function get(sql, params=[]) {
  return new Promise((resolve,reject)=>{
    db.get(sql, params, function(err,row){
      if(err) reject(err); else resolve(row);
    });
  });
}
function all(sql, params=[]) {
  return new Promise((resolve,reject)=>{
    db.all(sql, params, function(err,rows){
      if(err) reject(err); else resolve(rows);
    });
  });
}
module.exports = { db, run, get, all };
