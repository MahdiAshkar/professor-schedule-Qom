function allExceptionHandler(app) {
  app.use((err, req, res, next) => {
    let status = err?.statuscode ?? err?.status;
    if (!status || isNaN(+status) || status > 511 || status < 200) {
      status = 500;
    }
    res.status(status).json({
      statuscode: status,
      message: err?.message ?? err?.stack ?? "internal server Error",
    });
  });
}
module.exports = allExceptionHandler;
