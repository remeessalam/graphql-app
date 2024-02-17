const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
// const { buildSchema } = require("graphql"); //It takes a string and that string should define over schema.
const mongoose = require("mongoose");
const qraphqlSchema = require("./graphql/schema/index");
const qraphqlResolvers = require("./graphql/resolvers/index");
const isAuth = require("./middleware/is-auth");
const app = express();

app.use(bodyParser.json());

app.use(isAuth);

app.use(
  "/graphql",
  graphqlHTTP({
    schema: qraphqlSchema,
    rootValue: qraphqlResolvers,
    graphiql: true,
  })
);

// app.get("/", (req, res) => {
//   res.send("hello-world");
// });

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.6ncimah.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log("error :- ", err);
  });
