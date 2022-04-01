const env = require('./env/env.json')

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const sqlite = require("aa-sqlite")

const
{
  generateToken, getCleanUser, verifyToken, clearTokens, handleResponse,
} = require('./util');

const
{
    getUser, createUser,
    getPlantData, getLatestPlantData, getAllPlantData, uploadPlantData,
    getAllNotesFromUser, getNote, getUsersPlantNote, getLatestNoteFromUser, createNote, editNote, deleteNote
} = require('./databasehelper.js');

const app = express();
const port = env.PORT || 4000;

// enable CORS
app.use(cors({
  origin: env.WEBURL, // url of the frontend application
  credentials: true // set credentials true for secure httpOnly cookie
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const convertByteArrayToBase64 = function (byteArray) {
  var binary = '';
  var bytes = [].slice.call(new Uint8Array(byteArray));
  bytes.forEach((b) => binary += String.fromCharCode(b));
  return "data:image/png;base64," + btoa(binary);
}

// middleware that checks if JWT token exists and verifies it if it does exist.
const authMiddleware = function (req, res, next) {
    console.log("Received request needing auth.");

    var token = req.headers['authorization'];
    if (!token) return handleResponse(req, res, 401);

    token = token.replace('Bearer ', '');

  // verify token with secret key and xsrf token
  verifyToken(token, (err, payload) => {
    if (err)
    {
        console.log("error verifying token:" + err);
        return handleResponse(req, res, 401);
    }
    else {
      req.user = payload; //set the user to req so other routes can use it
      next();
    }
  });
}

// verify the token and return new tokens if it's valid
app.post('/verifyToken', function (req, res) {

    var token = req.headers['authorization'];
    if (!token) return handleResponse(req, res, 401);

    token = token.replace('Bearer ', '');


  verifyToken(token, (err, payload) =>
  {
    if (err)
    {
      return handleResponse(req, res, 401);
    }
    else
    {
      const userData = userList.find(x => x.userId === payload.userId);

      if (!userData)
      {
        return handleResponse(req, res, 401);
      }

      const userObj = getCleanUser(userData);

      const tokenObj = generateToken(userData);

      return handleResponse(req, res, 200,
      {
        user: userObj,
        token: tokenObj.token
      });
    }
  });

});


// ------------------------------------------------------------ //


// validate user credentials
app.post('/users/login', async function (req, res)
{
  const username = req.body.username;
  const password = req.body.password;

  // return 400 status if username/password is not exist
  if (!username || !password)
  {
    return handleResponse(req, res, 400, null, "Username and Password required.");
  }

  let userData = await getUser(username, password);

  if (userData == undefined)
  {
    return handleResponse(req, res, 401, null, "Username or Password is Wrong.");
  }

  const userObj = getCleanUser(userData);

  const tokenObj = generateToken(userData);

  return handleResponse(req, res, 200,
  {
    username: username,
    id: userData.id,
    token: tokenObj.token,
    expiredAt: tokenObj.expiredAt
  });
});

app.post('/users/signup', async function (req, res) {

    const username = req.body.username;
    const password = req.body.password;

    // return 400 status if username/password is not exist
    if (!username || !password)
    {
      return handleResponse(req, res, 400, null, "Username and Password required.");
    }

    let success = await createUser(username, password);

    return handleResponse(req, res, 201);


});

// handle user logout
app.post('/users/logout', (req, res) =>
{
  clearTokens(req, res);
  return handleResponse(req, res, 204);
});


// ------------------------------------------------------------ //


app.post('/plantData/getAll', authMiddleware, async function (req, res) {
    let plantData = (await getAllPlantData()).data;

    plantData.forEach((i) => { i.picture = convertByteArrayToBase64(i.picture)});
    return handleResponse(req, res, 200, plantData);
});

app.post('/plantData/get', authMiddleware, async function (req, res) {
    const plantID = req.body.id;

    let plantData = await getPlantData(plantID);

    plantData.picture = convertByteArrayToBase64(plantData.picture);

    return handleResponse(req, res, 200, plantData);
});

app.post('/plantData/getLatest', authMiddleware, async function (req, res) {
    let plantData = await getLatestPlantData();

    plantData.picture = convertByteArrayToBase64(plantData.picture);
    return handleResponse(req, res, 200, plantData);
});

app.post('/plantData/upload', authMiddleware, async function (req, res) {

    const dissolved_solids = req.body.TDS;
    const pressure = req.body.pressure;
    const temperature = req.body.temp;
    const humidity = req.body.humidity;
    const picture = req.body.picture;
    const red_light = req.body.red_light;
    const orange_light = req.body.orange_light;
    const yellow_light = req.body.yellow_light;
    const green_light = req.body.green_light;
    const light_blue_light = req.body.light_blue_light;
    const blue_light = req.body.blue_light;
    const purple_light = req.body.purple_light;
    const plant_number = req.body.plant_number;
    const number_of_leaves = -1;

    let plantData = await uploadPlantData(dissolved_solids, pressure, temperature, humidity, picture, number_of_leaves,
                              red_light, orange_light, yellow_light, green_light, light_blue_light, blue_light, purple_light, plant_number);

    return handleResponse(req, res, 201, plantData);
});


// ------------------------------------------------------------ //


app.post('/notes/getAll', authMiddleware, async function (req, res) {
    const userID = req.body.id;

    let notes = await getAllNotesFromUser(userID);
    console.log(notes);
    return handleResponse(req, res, 200, notes);
});

app.post('/notes/get', authMiddleware, async function (req, res) {
    const noteID = req.body.noteID;

    let note = await getNote(noteID);
    return handleResponse(req, res, 200, note);
});

app.post('/notes/getUsersPlantNote', authMiddleware, async function (req, res) {
    const userID = req.body.user_id;
    const plantID = req.body.plant_id;

    let note = await getUsersPlantNote(userID, plantID);
    console.log(note);
    return handleResponse(req, res, 200, note);
});

app.post('/notes/getLatest', authMiddleware, async function (req, res) {
    const userID = req.body.id;

    let note = await getLatestNoteFromUser(userID);
    return handleResponse(req, res, 200, note);
});

app.post('/notes/newNote', authMiddleware, async function (req, res) {
    const note = req.body;

    let plantData = await createNote(note);
    console.log(plantData);
    return handleResponse(req, res, 200);
});

app.post('/notes/updateNote', authMiddleware, async function (req, res) {
    const note = req.body;

    let plantData = await editNote(note);
    return handleResponse(req, res, 200);
});

app.post('/notes/deleteNote', authMiddleware, async function (req, res) {
    const note_id = req.body.id;

    let plantData = await deleteNote(note_id);
    return handleResponse(req, res, 200);
});


app.listen(port, () =>
{
  console.log('Server started on: ' + port);
});
