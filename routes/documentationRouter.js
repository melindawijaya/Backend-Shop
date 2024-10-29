const router = require("express").Router();
const swaggerUiExpress = require("swagger-ui-express");
const swaggerDocument = require("../docs/swagger.json");

router.use("/", swaggerUiExpress.serve);
router.use("/", swaggerUiExpress.setup(swaggerDocument));

module.exports = router;
