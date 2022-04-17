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

async function uploadPlantData(dissolved_solids, pressure, temperature, humidity, picture, number_of_leaves,
                          red_light, orange_light, yellow_light, green_light, light_blue_light, blue_light, purple_light, plant_number)
{
  try {
    await sqlite.open('../database/plantpod.sqlite3');

    let sql = 'INSERT INTO SensorData (date, dissolved_solids, pressure, temperature, humidity, picture, number_of_leaves, red_light, orange_light, yellow_light, green_light, light_blue_light, blue_light, purple_light, plant_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);'

    r = await sqlite.push(sql, [new Date().toLocaleString(), dissolved_solids, pressure, temperature, humidity, picture, number_of_leaves, red_light, orange_light, yellow_light, green_light, light_blue_light, blue_light, purple_light, plant_number]);

    return r;
  }
  catch (error)
  {
    console.log(error);
    return -1;
  }
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
  let sql = 'SELECT * FROM Notes WHERE id = ?'

  r = await sqlite.get(sql, [id]);

  if (r == undefined)
    r = {}

  return r;
}

async function getUsersPlantNote(userID, plantID)
{
  await sqlite.open('../database/plantpod.sqlite3');

  // SANITIZE DATA
  let sql = 'SELECT * FROM Notes WHERE user_id = ? AND sensor_data_id = ?'

  r = await sqlite.get(sql, [userID, plantID]);

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

  r = await sqlite.push(sql, [note.user_id, note.sensor_data_id, note.note, new Date().toLocaleString()]);

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

async function getImage(id)
{
  await sqlite.open('../database/plantpod.sqlite3');
  console.log(id);
  // SANITIZE DATA
  let sql = 'SELECT * FROM SensorData WHERE id = ?'

  r = await sqlite.get(sql, [id]);

  if (r == undefined)
    r = {}

  return r;
}

async function updateImage(id, picture)
{
  await sqlite.open('../database/plantpod.sqlite3');

  // SANITIZE DATA
  let sql = 'UPDATE SensorData SET picture = ? WHERE id = ?'

  r = await sqlite.push(sql, [picture, id]);

  if (r == undefined)
    r = {}

  return r;
}

module.exports =
{
  updateImage,
  getImage,

  getUser,
  createUser,

  getPlantData,
  getAllPlantData,
  getLatestPlantData,
  uploadPlantData,

  getAllNotesFromUser,
  getNote,
  getUsersPlantNote,
  getLatestNoteFromUser,
  createNote,
  editNote,
  deleteNote
}
