// jwtMiddleware.js

const jwtMiddleware = (req, res, next) => {
  // Extract JWT token from cookies
  const token = req.cookies?.jwtToken;

  // Attach the token to the Authorization header
  token && (req.headers.authorization = token);

  // Proceed to the next middleware/route handler
  next();
};

module.exports = jwtMiddleware;
