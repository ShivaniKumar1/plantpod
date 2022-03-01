const env = require('./env/env.json')

const jwt = require('jsonwebtoken');
const moment = require('moment');
const randtoken = require('rand-token');
const ms = require('ms');

const dev = env.NODE_ENV !== 'production';


// generate tokens and return it
function generateToken(user)
{
  if (!user) return null;

  const u =
  {
    name: user.username,
  };

  // generate access token and expiry date
  const token = jwt.sign(u, env.JWT_SECRET, { expiresIn: env.ACCESS_TOKEN_LIFE });

  // expiry time of the access token
  const expiredAt = moment().add(ms(env.ACCESS_TOKEN_LIFE), 'ms').valueOf();

  return { token, expiredAt }
}

function verifyToken(token, cb)
{
  jwt.verify(token, env.JWT_SECRET, cb);
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
  
}

module.exports =
{
  generateToken,
  verifyToken,
  getCleanUser,
  handleResponse,
  clearTokens
}
