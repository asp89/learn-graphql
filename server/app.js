const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const morgan = require("morgan");
const connectWithDb = require("./config/db");
const cors = require("cors");
const app = express();

// SECTION: morgan middleware
app.use(morgan("tiny"));
// !SECTION

connectWithDb();

// SECTION: router middleware
const schema = require("./schema/schema")
const testSchema = require("./schema/types_schema")

app.use(cors());
app.use(
  "/graphql",
  graphqlHTTP({
    graphiql: true,
    schema
    // schema: testSchema
  })
);

// !SECTION

module.exports = app;
