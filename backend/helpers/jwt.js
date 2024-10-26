const { expressjwt: expressJwt } = require("express-jwt");

function authJwt() {
  const segredo = process.env.segredo;
  return expressJwt({
    secret: segredo,
    algorithms: ["HS256"],
  });
}

module.exports = authJwt;
