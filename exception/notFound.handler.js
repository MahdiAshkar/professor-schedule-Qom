function notFoundHandler(app) {
  app.use((req, res, next) => {
    res.status(404).json({
      message: "not found routes",
    });
  });
}
module.exports = notFoundHandler;
