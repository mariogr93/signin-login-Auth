const express = require("express");
const cors = require("cors");
const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.options("*", cors());

//routes
app.use(require("./src/routes/routes"));

app.listen(3000);

console.log("server on port 3k");
