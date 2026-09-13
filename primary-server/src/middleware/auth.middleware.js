const jwt = require("jsonwebtoken");
const { ApiError } = require("../utils/ApiError");
const { asyncHandler } = require("../utils/asyncHandler");
const userRepository = require("../repositories/user.repository");

const requireAuth = asyncHandler(async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(401, "Unauthorized request", "UNAUTHORIZED");
    }

    const token = authHeader.replace("Bearer ", "");
    if (!token) {
      throw new ApiError(401, "Unauthorized request", "UNAUTHORIZED");
    }

    const decodedToken = jwt.verify(token, process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || "default_access_secret");

    const user = await userRepository.findUserById(decodedToken.sub);

    if (!user) {
      throw new ApiError(401, "Invalid Access Token", "INVALID_TOKEN");
    }

    if (!user.isActive) {
      throw new ApiError(401, "Account is disabled", "ACCOUNT_DISABLED");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      next(new ApiError(401, "Token has expired", "TOKEN_EXPIRED"));
    } else if (error.name === "JsonWebTokenError") {
      next(new ApiError(401, "Invalid Access Token", "INVALID_TOKEN"));
    } else {
      next(error);
    }
  }
});

module.exports = { requireAuth };
