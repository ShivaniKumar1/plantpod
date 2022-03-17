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
  let sql = 'INSERT INTO Users (user_name, password) VALUES (?, ?);'

  r = await sqlite.push(sql, [username, password]);

  return r;
}

async function getAllPlantData()
{
  await sqlite.open('../database/plantpod.sqlite3');

  // SANITIZE DATA
  let sql = 'SELECT * FROM SensorData';

  r = await sqlite.get_all(sql, []);

  if (r == undefined)
    r = {}

  return r;
}

async function getPlantData(id)
{
  await sqlite.open('../database/plantpod.sqlite3');

  // SANITIZE DATA
  let sql = 'SELECT * FROM SensorData WHERE id = ?'

  r = await sqlite.get(sql, [id]);

  if (r == undefined)
    r = {}

  return r;
}

async function getLatestPlantData()
{
  await sqlite.open('../database/plantpod.sqlite3');

  let sql = 'SELECT * FROM SensorData ORDER BY date DESC LIMIT 1'

  r = await sqlite.get(sql, []);

  if (r == undefined)
    r = {}

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

  return r;
}

async function getNote(id)
{
  await sqlite.open('../database/plantpod.sqlite3');

  // SANITIZE DATA
  let sql = 'SELECT * FROM Note WHERE id = ?'

  r = await sqlite.get(sql, [id]);

  if (r == undefined)
    r = {}

  return r;
}

async function getLatestNoteFromUser(userID)
{
  await sqlite.open('../database/plantpod.sqlite3');

  // SANITIZE DATA
  let sql = 'SELECT * FROM Notes WHERE id = ? ORDER BY date DESC LIMIT 1'

  r = await sqlite.get(sql, [userID]);

  if (r == undefined)
    r = {}

  return r;
}

async function createNote(note)
{
  await sqlite.open('../database/plantpod.sqlite3');

  // SANITIZE DATA
  let sql = 'INSERT INTO Notes (user_id, sensor_data_id, note, date) VALUES (?, ?, ?, ?)'

  r = await sqlite.push(sql, [note.userID, note.sensorDataID, note.note, new Date().toLocaleString()]);

  return true;
}

async function editNote(note)
{
  await sqlite.open('../database/plantpod.sqlite3');

  console.log(note);
  // SANITIZE DATA
  let sql = 'UPDATE Notes SET note = ?, date = ? where id = ?'

  r = await sqlite.push(sql, [note.note, new Date().toLocaleString(), note.id]);
  console.log(r);
  sqlite.close();

  return true;
}

async function deleteNote(id)
{
  await sqlite.open('../database/plantpod.sqlite3');

  // SANITIZE DATA
  let sql = 'DELETE FROM Notes WHERE id = ?'

  r = await sqlite.push(sql, [id]);

  return true;
}


module.exports =
{
  getUser,
  createUser,

  getPlantData,
  getAllPlantData,
  getLatestPlantData,

  getAllNotesFromUser,
  getNote,
  getLatestNoteFromUser,
  createNote,
  editNote,
  deleteNote
}
