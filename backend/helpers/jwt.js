const { expressjwt: expressJwt } = require("express-jwt"); // Ajuste na importação

function authJwt() {
  const segredo = process.env.segredo;
  return expressJwt({
    secret: segredo, // Ajuste: 'secret' ao invés de 'segredo'
    algorithms: ["HS256"],
  });
}

module.exports = authJwt;
