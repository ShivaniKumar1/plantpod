const sqlite3 = require('sqlite3').verbose();
const sqlite = require("aa-sqlite")

async function getUser(username, password)
{
  await sqlite.open('../database/plantpod.sqlite3');

  // SANITIZE DATA
  let sql = 'SELECT * FROM Users WHERE user_name = \'' + username + '\' AND password = \'' + password +'\''

  r = await sqlite.get(sql);
  console.log(r);
  return r;
}



module.exports =
{
  getUser
}
