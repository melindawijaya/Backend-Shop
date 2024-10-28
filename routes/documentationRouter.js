const swaggerUiExpress = require("swagger-ui-express");
const swaggerDocument = require("../docs/swagger.json");
const router = require("express").Router();

router.use("/", swaggerUiExpress.serve);
router.use("/", swaggerUiExpress.setup(swaggerDocument));

module.exports = router;
