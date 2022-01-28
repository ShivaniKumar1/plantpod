require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const
{
  refreshTokens, COOKIE_OPTIONS, generateToken, generateRefreshToken,
  getCleanUser, verifyToken, clearTokens, handleResponse,
} = require('./util');

const
{
  doesUserExist
} = require('./databasehelper.js');

const app = express();
const port = process.env.PORT || 4000;

// to be replaced with sql once implemented
const userList = [
  {
    userId: "123",
    password: "test1",
    name: "test1",
    username: "test1"
  },
  {
    userId: "456",
    password: "test2",
    name: "test2",
    username: "test2"
  },
  {
    userId: "789",
    password: "testpass",
    name: "testname",
    username: "testuser"
  }
]

// enable CORS
app.use(cors({
  origin: 'http://localhost:3000', // url of the frontend application
  credentials: true // set credentials true for secure httpOnly cookie
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));


// middleware that checks if JWT token exists and verifies it if it does exist.
const authMiddleware = function (req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.headers['authorization'];
  if (!token) return handleResponse(req, res, 401);

  token = token.replace('Bearer ', '');

  const xsrfToken = req.headers['x-xsrf-token'];
  if (!xsrfToken)
  {
    return handleResponse(req, res, 403);
  }

  // verify xsrf token
  const { signedCookies = {} } = req;
  const { refreshToken } = signedCookies;

  if (!refreshToken || !(refreshToken in refreshTokens) || refreshTokens[refreshToken] !== xsrfToken)
  {
    return handleResponse(req, res, 401);
  }

  verifyToken(token, xsrfToken, (err, payload) =>
  {
    if (err)
      return handleResponse(req, res, 401);
    else
    {
      req.user = payload; //set the user to req so other routes can use it
      next();
    }
  });
}


// validate user credentials
app.post('/users/signin', async function (req, res)
{
  const user = req.body.username;
  const pwd = req.body.password;

  // return 400 status if username/password is not exist
  if (!user || !pwd)
  {
    return handleResponse(req, res, 400, null, "Username and Password required.");
  }

  let auth = await doesUserExist(user, pwd);

  console.log('Auth is' + auth);

  // SANITIZE INPUT (once we switch to grabing from sql)
  const userData = userList.find(x => x.username === user && x.password === pwd);

  // return 401 status if the credential is not matched
  if (!userData)
  {
    return handleResponse(req, res, 401, null, "Username or Password is Wrong.");
  }

  const userObj = getCleanUser(userData);

  const tokenObj = generateToken(userData);

  const refreshToken = generateRefreshToken(userObj.userId);

  // refresh token list to manage the xsrf token
  refreshTokens[refreshToken] = tokenObj.xsrfToken;

  // set cookies
  res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
  res.cookie('XSRF-TOKEN', tokenObj.xsrfToken);

  return handleResponse(req, res, 200,
  {
    user: userObj,
    token: tokenObj.token,
    expiredAt: tokenObj.expiredAt
  });
});


// handle user logout
app.post('/users/logout', (req, res) =>
{
  clearTokens(req, res);
  return handleResponse(req, res, 204);
});


// verify the token and return new tokens if it's valid
app.post('/verifyToken', function (req, res) {

  const { signedCookies = {} } = req;
  const { refreshToken } = signedCookies;

  if (!refreshToken)
  {
    return handleResponse(req, res, 204);
  }

  // verify xsrf token
  const xsrfToken = req.headers['x-xsrf-token'];
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
      res.cookie('XSRF-TOKEN', tokenObj.xsrfToken);

      return handleResponse(req, res, 200,
      {
        user: userObj,
        token: tokenObj.token,
        expiredAt: tokenObj.expiredAt
      });
    }
  });

});


// get list of the users
app.get('/users/getList', authMiddleware, (req, res) =>
{
  const list = userList.map(x =>
  {
    const user = { ...x };
    delete user.password;
    return user;
  });

  return handleResponse(req, res, 200, { random: Math.random(), userList: list });

});


app.listen(port, () =>
{
  console.log('Server started on: ' + port);
});
