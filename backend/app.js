// Sistema de e-commerce da equipe JAJIG

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");

require("dotenv/config");
const api = process.env.API_URL;

const productsRoutes = require("../routers/products");
const categoriesRoutes = require("../routers/categories");
const usuariosRoutes = require("../routers/usuarios");
const pedidosRoutes = require("../routers/pedidos");

//middleware
app.use(bodyParser.json());
app.use(morgan("tiny"));

//Routers
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/usuarios`, usuariosRoutes);
app.use(`${api}/pedidos`, pedidosRoutes);

// Conexão com o bando de dados
mongoose
  .connect(process.env.CONNECTION_STRING, {
    dbName: "e-commerce-db",
  })
  .then(() => {
    console.log("Banco de dados está conectado...");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(3000, () => {
  console.log(api);
  console.log("servidor está rodando http://localhost:3000");
});
