const env = require('./env/env.json')

const jwt = require('jsonwebtoken');
const moment = require('moment');
const randtoken = require('rand-token');
const ms = require('ms');

const dev = env.NODE_ENV !== 'production';

// refresh token list to manage the xsrf token
const refreshTokens = {};

// cookie options to create refresh token
const COOKIE_OPTIONS =
{
  // domain: "localhost",
  httpOnly: true,
  secure: !dev,
  signed: true
};

// generate tokens and return it
function generateToken(user)
{
  if (!user) return null;

  const u =
  {
    name: user.username,
  };

  // generat xsrf token and use it to generate access token
  const xsrfToken = randtoken.generate(24);

  // create private key by combining JWT secret and xsrf token
  const privateKey = env.JWT_SECRET + xsrfToken;

  // generate access token and expiry date
  const token = jwt.sign(u, privateKey, { expiresIn: env.ACCESS_TOKEN_LIFE });

  // expiry time of the access token
  const expiredAt = moment().add(ms(env.ACCESS_TOKEN_LIFE), 'ms').valueOf();

  return { token, expiredAt, xsrfToken }
}

// generate refresh token
function generateRefreshToken(userId)
{
  if (!userId) return null;

  return jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: env.REFRESH_TOKEN_LIFE });
}

// verify access token and refresh token
function verifyToken(token, xsrfToken = '', cb)
{
  const privateKey = env.JWT_SECRET + xsrfToken;
  jwt.verify(token, privateKey, cb);
}

// return basic user details
function getCleanUser(user)
{

  if (!user) return null;

  return {
    password: user.password,
    username: user.username
  };
}

// handle the API response
function handleResponse(req, res, statusCode, data, message)
{

  let isError = false;
  let errorMessage = message;

  switch (statusCode)
  {
    case 200:
        const resObj = data || {};
        return res.status(statusCode).json(resObj);
    case 204:
      return res.sendStatus(204);
    case 400:
      isError = true;
      break;
    case 401:
      isError = true;
      errorMessage = message || 'Invalid user.';
      clearTokens(req, res);
      break;
    case 403:
      isError = true;
      errorMessage = message || 'Access to this resource is denied.';
      clearTokens(req, res);
      break;
    default:
      console.log('Unknown statuscode: ' + statusCode);
      break;
  }

  const resObj = data || {};

  if (isError)
  {
    resObj.error = true;
    resObj.message = errorMessage;
  }

  return res.status(statusCode).json(resObj);
}

// clear tokens from cookie
function clearTokens(req, res)
{
  const { signedCookies = {} } = req;
  const { refreshToken } = signedCookies;
  delete refreshTokens[refreshToken];

  res.clearCookie('XSRF-TOKEN');
  res.clearCookie('refreshToken', COOKIE_OPTIONS);
}

module.exports =
{
  refreshTokens,
  COOKIE_OPTIONS,
  generateToken,
  generateRefreshToken,
  verifyToken,
  getCleanUser,
  handleResponse,
  clearTokens
}
