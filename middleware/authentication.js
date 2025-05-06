const jwt = require("jsonwebtoken");

// Middleware to verify Admin token
function verifyAdmin(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).send({
      result: "Fail",
      reason: "Token Missing. You Are Not Authorized to Access this API",
    });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET_KEY_ADMIN);
    next();
  } catch (error) {
    handleTokenError(error, res);
  }
}

// Middleware to verify Buyer or Admin token
function verifyBoth(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).send({
      result: "Fail",
      reason: "Token Missing. You Are Not Authorized to Access this API",
    });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET_KEY_BUYER);
    return next();
  } catch (error) {
    try {
      jwt.verify(token, process.env.JWT_SECRET_KEY_ADMIN);
      return next();
    } catch (err) {
      handleTokenError(err, res);
    }
  }
}

// Reusable error handler function
function handleTokenError(error, res) {
  if (error.name === "TokenExpiredError") {
    res.status(498).send({
      result: "Fail",
      reason: "Token Expired. Please Login Again to Access this API",
    });
  } else {
    res.status(401).send({
      result: "Fail",
      reason: "You Are Not An Authorized Person to Access this API",
    });
  }
}

module.exports = {
  verifyAdmin,
  verifyBoth,
};
