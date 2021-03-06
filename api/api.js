const env = require('./env/env.json')

const express = require('express');
const {spawn} = require('child_process');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const sqlite = require("aa-sqlite");
var fileSystem = require('fs');

const
{
  generateToken, getCleanUser, verifyToken, clearTokens, handleResponse,
} = require('./util');

const
{
    updateImage, getImage, removeBadData,
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

    // Don't return the pictures with getall, the request will be to big and crash it
    plantData.forEach((i) => { i.picture = null});

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

function between(min, max) {
  return Math.floor(
    Math.random() * (max - min + 1) + min
  )
}

app.post('/dev/fixImages', async function (req, res) {

    /*
    const python = spawn('python3', ['./machine_learning/segmenter.py', "--inputImage './machine_learning/plant-test.png'", "--weightsPath ./machine_learning/leafSegmenter0005.h5", "--useCPU"]);
    python.stdout.on('data', function (data) {
      if (data.toString().includes("&result:"));
      number_of_leaves = data.replace("&result:", "");
    });
    */
    await removeBadData();

    let number_of_leaves = -1;

    for (var i = 0; i < 6005; i++)
    {
      let plantData = await getImage(i);
      if (plantData.red_light == undefined)
        1==1
      else if (plantData.red_light > .06)
      {
        let rand = between(1, 4);
        let img = fileSystem.readFileSync('./machine_learning/plantimglight' + rand +'.png');
        if (rand == 1)
          number_of_leaves = 33
        if (rand == 2)
          number_of_leaves = 26
        if (rand == 3)
          number_of_leaves = 35
        if (rand == 4)
          number_of_leaves = 27

        let plantData = await updateImage(i, img, number_of_leaves);
      }
      else
      {
        let rand = 1;
        let img = fileSystem.readFileSync('./machine_learning/plantimgnight' + rand +'.png');

        let plantData = await updateImage(i, img, 15);
      }
    }

    const python = spawn('python3', ['./machine_learning/segmenter.py', "--inputImage", './machine_learning/plantimglight' + 1 +'.png', "--weightsPath", "./machine_learning/leafSegmenter0005.h5", "--useCPU"]);
    python.stdout.on('data', function (data) {
      number_of_leaves = Number(data);
      console.log("leaves: " + number_of_leaves);
    });

    return handleResponse(req, res, 200, "yes");
});

app.post('/plantData/upload', async function (req, res) {
    //console.log(req);
    console.log(req.body);

    let dissolved_solids = req.body.TDS;
    let pressure = req.body.pressure;
    let temperature = req.body.temp;
    let humidity = req.body.humidity;
    let red_light = req.body.red;
    let orange_light = req.body.orange;
    let yellow_light = req.body.yellow;
    let green_light = req.body.green;
    let light_blue_light = req.body.light_blue;
    let blue_light = req.body.blue;
    let purple_light = req.body.purple;
    //const plant_number = req.body.plant_number;
    let number_of_leaves = -1;
    let picture = undefined;
    let picturePath = "";

    if (red_light > .06)
    {
      let rand = between(1, 4);
      picturePath = './machine_learning/plantimglight' + rand +'.png';
      picture = fileSystem.readFileSync(picturePath);
    }
    else
    {
      let rand = 1;
      picturePath = './machine_learning/plantimgnight' + rand +'.png';
      picture = fileSystem.readFileSync(picturePath);
    }

    const python = spawn('python3', ['./machine_learning/segmenter.py', "--inputImage", picturePath, "--weightsPath", "./machine_learning/leafSegmenter0005.h5", "--useCPU"]);
    python.stdout.on('data', function (data) {
      number_of_leaves = Number(data);
      console.log("leaves: " + number_of_leaves);
    });

    let plantData = await uploadPlantData(dissolved_solids, pressure, temperature, humidity, picture, number_of_leaves,
                            red_light, orange_light, yellow_light, green_light, light_blue_light, blue_light, purple_light, 1);

    return handleResponse(req, res, 201, req.body);
});

app.post('/plantData/uploadPicture', async function(req, res) {
    console.log(req);
    console.log(req.body);

    return handleResponse(req, res, 201, req.body);
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
