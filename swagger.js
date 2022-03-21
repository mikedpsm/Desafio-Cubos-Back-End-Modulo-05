const swaggerAutogen = require("swagger-autogen");

swaggerAutogen()("./swagger.json", ["./src/routes/route.js"]);
