const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const morgan = require("morgan");

const app = express();

// SECTION: morgan middleware
app.use(morgan("tiny"));
// !SECTION

// SECTION: router middleware
const schema = require("./schema/schema")

app.use(
  "/graphql",
  graphqlHTTP({
    graphiql: true,
    schema
  })
);

// !SECTION

module.exports = app;
