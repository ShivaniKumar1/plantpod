const sqlite3 = require('sqlite3').verbose();
const sqlite = require("aa-sqlite")
// https://www.npmjs.com/package/aa-sqlite

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

  r = await sqlite.push(sql, []);

  aaSqlite.close();

  return r;
}

async function getPlantData()
{
  await sqlite.open('../database/plantpod.sqlite3');

  // SANITIZE DATA
  let sql = 'SELECT * FROM SensorData'

  r = await sqlite.get_all(sql);

  if (r == undefined)
    r = {}

  console.log("Plant Data:\n");
  console.log(r);

  aaSqlite.close();

  return r;
}


async function getAllNotesFromUser(userID)
{
  await sqlite.open('../database/plantpod.sqlite3');

  // SANITIZE DATA
  let sql = 'SELECT * FROM Notes WHERE user_id = ?'

  r = await sqlite.get_all(sql, [userID]);

  if (r == undefined)
    r = {}

  aaSqlite.close();

  return r;
}

async function getNote(id)
{
  await sqlite.open('../database/plantpod.sqlite3');

  // SANITIZE DATA
  let sql = 'SELECT * FROM Note WHERE id = ?'

  r = await sqlite.get_all(sql, [id]);

  if (r == undefined)
    r = {}

  aaSqlite.close();

  return r;
}

async function createNote(note)
{
  await sqlite.open('../database/plantpod.sqlite3');

  // SANITIZE DATA
  let sql = 'INSERT INTO Notes (user_id, sensor_data_id, note, date) VALUES (?, ?, ?, ?)'

  r = await sqlite.push(sql, [note.UserID, note.SensorDataID, note.Note, new Date().toLocaleString()]);


  aaSqlite.close();

  return true;
}

async function editNote(note)
{
  await sqlite.open('../database/plantpod.sqlite3');

  // SANITIZE DATA
  let sql = 'UPDATE Notes SET note = ?, date = ? where id = ?'

  r = await sqlite.push(sql, [note.Note, new Date().toLocaleString(), note.ID]);

  aaSqlite.close();

  return true;
}

async function deleteNote(id)
{
  await sqlite.open('../database/plantpod.sqlite3');

  // SANITIZE DATA
  let sql = 'DELETE FROM Notes WHERE id = ?'

  r = await sqlite.push(sql, [id]);

  aaSqlite.close();

  return true;
}


module.exports =
{
  getUser,
  createUser,
  getPlantData,

  getAllNotesFromUser,
  getNote,
  createNote,
  editNote,
  deleteNote
}
