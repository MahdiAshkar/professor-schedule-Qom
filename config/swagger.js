const path = require("path");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerPath = path.join(process.cwd(), "module", "**", "*.swagger.js");
function swaggerConfig(app) {
  const options = {
    swaggerDefinition: {
      openapi: "3.0.1",
      info: {
        title: "API Schedule Professor",
        description: "University Qom  schedule professors ",
        version: "1.0.0",
      },
    },
    apis: [swaggerPath],
  };
  const swaggerDocument = swaggerJsDoc(options);
  //Swagger page
  app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  //Docs in JSON format
  app.get("/docs.json", (req, res) => {
    res.setHeader("content-Type", "application/json");
    res.send(swaggerDocument);
  });
}

module.exports = swaggerConfig;
