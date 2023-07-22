// Middleware
const initializeClient = (req, res, next) => {
  req.client = req.app.get("client");
  next();
};

module.exports = { initializeClient };
