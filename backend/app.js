// Sistema de e-commerce da equipe JAJIG

const express = require("express"); // Framework para criar API
const app = express();
const bodyParser = require("body-parser"); // Middleware para interpretar JSON
const morgan = require("morgan"); // Middleware para registrar logs HTTP
const mongoose = require("mongoose"); // Biblioteca para interagir com o MongoDB
const cors = require("cors"); // Middleware que habilita o compartilhamento de recursos entre diferentes origens
require("dotenv/config"); // Carrega variáveis de ambiente
const api = process.env.API_URL; 

// Importação das rotas
const produtosRoutes = require("./routers/produtos");
const categoriasRoutes = require("./routers/categorias");
const usuariosRoutes = require("./routers/usuarios");
const pedidosRoutes = require("./routers/pedidos");
const authJwt = require("./helpers/jwt");
const errorHandler = require("./helpers/error-handler");

//middlewares globais
app.use(cors());
app.options("*", cors());
app.use(bodyParser.json());
app.use(morgan("tiny"));
app.use(authJwt());
app.use(errorHandler);

//Definições das rotas
app.use(`${api}/produtos`, produtosRoutes);
app.use(`${api}/categorias`, categoriasRoutes);
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
