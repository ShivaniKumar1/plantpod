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
    getUser, createUser, getPlantData,
    getAllNotesFromUser, getNote, createNote, editNote, deleteNote
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


// middleware that checks if JWT token exists and verifies it if it does exist.
const authMiddleware = function (req, res, next) {
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
    let plantData = await getPlantData();
    console.log(plantData);
    return handleResponse(req, res, 200, plantData);
});


// ------------------------------------------------------------ //


app.post('/notes/newNote', authMiddleware, async function (req, res) {
    const note = req.body.Note;

    let plantData = await createNote();
    console.log(plantData);
    return handleResponse(req, res, 200, plantData);
});

app.post('/notes/updateNote', authMiddleware, async function (req, res) {
    const note = req.body.Note;

    let plantData = await editNote();
    return handleResponse(req, res, 200, plantData);
});

app.post('/notes/deleteNote', authMiddleware, async function (req, res) {
    const noteID = req.body.NoteID;

    let plantData = await deleteNote(noteID);
    return handleResponse(req, res, 200, plantData);
});

app.post('/notes/getAll', authMiddleware, async function (req, res) {
    const userID = req.body.UserID;

    let plantData = await getAllNotesFromUser(userID);
    return handleResponse(req, res, 200, plantData);
});

app.post('/notes/get', authMiddleware, async function (req, res) {
    const noteID = req.body.NoteID;

    let plantData = await getNote(noteID);
    return handleResponse(req, res, 200, plantData);
});


app.listen(port, () =>
{
  console.log('Server started on: ' + port);
});
