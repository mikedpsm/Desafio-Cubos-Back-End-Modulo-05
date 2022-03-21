require("dotenv").config();

const swaggerUI = require("swagger-ui-express");
const cors = require("cors");
const express = require("express");
const router = require("./routes/route");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", router);
app.use("/docs", swaggerUI.serve, swaggerUI.setup(require("../swagger.json")));

app.listen(process.env.PORT || 5000);
