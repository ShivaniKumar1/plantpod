const sqlite3 = require('sqlite3').verbose();

async function doesUserExist(username, password)
{
  let db = new sqlite3.Database('../database/plantpod.sqlite3', sqlite3.OPEN_READONLY, (err) =>
  {
    if (err)
    {
      return console.error(err.message);
    }
    console.log('Connected to db.');
  });

  // SANITIZE DATA
  let sql = 'SELECT * FROM Users WHERE user_name = \'' + username + '\' AND password = \'' + password +'\''

  let userExists = await db.get(sql, (err, row) => {
    if (err) {
      return console.error(err.message);
    }
    if (row.id == undefined)
      return false;

    return true;
  });

  db.close((err) =>
  {
    if (err)
    {
      return console.error(err.message);
    }
    console.log('Close the database connection.');
  });
  return userExists;

}



module.exports =
{
  doesUserExist
}
