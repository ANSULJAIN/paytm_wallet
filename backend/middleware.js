const jwt = require('jsonwebtoken');
const JWT_SECRET = require('./config.js');

const middleware = (req, res, next) => {
  const authuser = req.headers.authorization;

  if (!authuser || !authuser.startsWith('Bearer ')) {
    return res.status(403).json({});
  }

  const token = authuser.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userid = decoded.userId;
    next();
  } catch (err) {
    return res.status(403).json({});
  }
};

module.exports =   middleware;


