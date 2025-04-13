const jwt = require("jsonwebtoken");

// 🔐 Token extractor (handles Bearer too)
function extractToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;

  if (authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7); // Remove "Bearer " from string
  }
  return authHeader;
}

// ✅ Admin verify middleware
function verifyAdmin(req, res, next) {
  const token = extractToken(req);
  const secret = process.env.JWT_SECRET_KEY_ADMIN;

  if (!token) {
    return res.status(401).json({
      result: "Fail",
      reason: "Authorization token missing",
    });
  }

  if (!secret) {
    return res.status(500).json({
      result: "Fail",
      reason: "Admin secret key not configured in environment",
    });
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.admin = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(498).json({
        result: "Fail",
        reason: "Token Expired. Please Login Again to Access this API",
      });
    }

    return res.status(401).json({
      result: "Fail",
      reason: "You Are Not An Authorized Person to Access this API",
    });
  }
}

// ✅ Buyer or Admin verify middleware
function verifyBoth(req, res, next) {
  const token = extractToken(req);
  const buyerSecret = process.env.JWT_SECRET_KEY_BUYER;
  const adminSecret = process.env.JWT_SECRET_KEY_ADMIN;

  if (!token) {
    return res.status(401).json({
      result: "Fail",
      reason: "Authorization token missing",
    });
  }

  try {
    const decodedBuyer = jwt.verify(token, buyerSecret);
    req.user = decodedBuyer;
    return next();
  } catch (buyerErr) {
    try {
      const decodedAdmin = jwt.verify(token, adminSecret);
      req.admin = decodedAdmin;
      return next();
    } catch (adminErr) {
      const error = adminErr.name === "TokenExpiredError" ? adminErr : buyerErr;

      if (error.name === "TokenExpiredError") {
        return res.status(498).json({
          result: "Fail",
          reason: "Token Expired. Please Login Again to Access this API",
        });
      }

      return res.status(401).json({
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
