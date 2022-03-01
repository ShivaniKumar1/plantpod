const env = require('./env/env.json')

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const sqlite = require("aa-sqlite")

const
{
  refreshTokens, COOKIE_OPTIONS, generateToken, generateRefreshToken,
  getCleanUser, verifyToken, clearTokens, handleResponse,
} = require('./util');

const
{
    getUser, createUser, getPlantData
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
app.use(cookieParser(env.COOKIE_SECRET));


// middleware that checks if JWT token exists and verifies it if it does exist.
const authMiddleware = function (req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.headers['authorization'];
  if (!token) return handleResponse(req, res, 401);

  token = token.replace('Bearer ', '');

  // get xsrf token from the header
  const xsrfToken = req.headers['x-xsrf-token'];
  if (!xsrfToken) {
    return handleResponse(req, res, 403);
  }

  // verify xsrf token
  const { signedCookies = {} } = req;
  const { refreshToken } = signedCookies;

  if (!refreshToken || !(refreshToken in refreshTokens) || refreshTokens[refreshToken] !== xsrfToken) {
    return handleResponse(req, res, 401);
  }

  // verify token with secret key and xsrf token
  verifyToken(token, xsrfToken, (err, payload) => {
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

  const refreshToken = generateRefreshToken(userData.id);

  // refresh token list to manage the xsrf token
  refreshTokens[refreshToken] = tokenObj.xsrfToken;
  res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);

  return handleResponse(req, res, 200,
  {
    username: username,
    token: tokenObj.token,
    xsrf: tokenObj.xsrfToken,
    refresh: refreshToken,
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


// verify the token and return new tokens if it's valid
app.post('/verifyToken', function (req, res) {

  const refreshToken = req.headers['refresh-token'];

  if (!refreshToken)
  {
    return handleResponse(req, res, 204);
  }



  // verify xsrf token
  const xsrfToken = req.headers['x-xsrf-token'];

  console.log(token);
  console.log(refreshtoken);
  console.log(xsrfToken);

  if (!xsrfToken || !(refreshToken in refreshTokens) || refreshTokens[refreshToken] !== xsrfToken)
  {
    return handleResponse(req, res, 401);
  }

  verifyToken(refreshToken, '', (err, payload) =>   // verify refresh token
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

      // refresh token list to manage the xsrf token
      refreshTokens[refreshToken] = tokenObj.xsrfToken;

      return handleResponse(req, res, 200,
      {
        user: userObj,
        token: tokenObj.token,
        xsrf: tokenObj.xsrfToken,
        expiredAt: tokenObj.expiredAt
      });
    }
  });

});



app.post('/plantData/getAll', authMiddleware, async function (req, res) {
    let plantData = await getPlantData();
    console.log(plantData);
    return handleResponse(req, res, 200, plantData);

});

app.listen(port, () =>
{
  console.log('Server started on: ' + port);
});
