const { expressjwt: expressJwt } = require("express-jwt");

// FUNÇÃO PARA APENAS USUÁRIOS AUTENTICADOS USAR AS APIs DO SISTEMA
function authJwt() {
  const segredo = process.env.segredo;
  const api = process.env.API_URL;
  return expressJwt({
    secret: segredo,
    algorithms: ["HS256"],
  }).unless({
    // DEFININDO AS APIs QUE USUÁRIOS NÃO AUTENTICADOS PODERÃO USAR
    path: [
      { url: /\/api\/v1\/produtos(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/categorias(.*)/, methods: ["GET", "OPTIONS"] },
      `${api}/usuarios/login`,
      `${api}/usuarios/cadastro`,
    ],
  });
}

module.exports = authJwt;
