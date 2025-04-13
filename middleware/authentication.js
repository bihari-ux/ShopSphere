const jwt = require("jsonwebtoken");

function verifyAdmin(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).send({
      result: "Fail",
      reason: "Authorization token missing",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY_ADMIN);
    req.admin = decoded; // Optional: attach to req
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(498).send({
        result: "Fail",
        reason: "Token Expired. Please Login Again to Access this API",
      });
    }

    return res.status(401).send({
      result: "Fail",
      reason: "You Are Not An Authorized Person to Access this API",
    });
  }
}

function verifyBoth(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).send({
      result: "Fail",
      reason: "Authorization token missing",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY_BUYER);
    req.user = decoded; // Optional
    return next();
  } catch (buyerErr) {
    try {
      const decodedAdmin = jwt.verify(token, process.env.JWT_SECRET_KEY_ADMIN);
      req.admin = decodedAdmin; // Optional
      return next();
    } catch (adminErr) {
      const err = adminErr.name === "TokenExpiredError" ? adminErr : buyerErr;

      if (err.name === "TokenExpiredError") {
        return res.status(498).send({
          result: "Fail",
          reason: "Token Expired. Please Login Again to Access this API",
        });
      }

      return res.status(401).send({
        result: "Fail",
        reason: "You Are Not An Authorized Person to Access this API",
      });
    }
  }
}

module.exports = {
  verifyAdmin,
  verifyBoth,
};
