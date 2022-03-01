const sqlite3 = require('sqlite3').verbose();
const sqlite = require("aa-sqlite")

async function getUser(username, password)
{
  await sqlite.open('../database/plantpod.sqlite3');

  // SANITIZE DATA
  let sql = 'SELECT * FROM Users WHERE user_name = \'' + username + '\' AND password = \'' + password +'\''

  r = await sqlite.get(sql);
  return r;
}

async function createUser(username, password)
{
  await sqlite.open('../database/plantpod.sqlite3');

  // SANITIZE DATA
  let sql = 'INSERT INTO Users VALUES (\'' + username + '\', \'' + password +'\');'

  r = await sqlite.run(sql);
  return r;
}

async function getPlantData()
{
  await sqlite.open('../database/plantpod.sqlite3');

  // SANITIZE DATA
  let sql = 'SELECT * FROM SensorData'

  r = await sqlite.get(sql);

  if (r == undefined)
    r = {}

  console.log("Plant Data:\n");
  console.log(r);
  return r;
}



module.exports =
{
  getUser,
  createUser,
  getPlantData
}
