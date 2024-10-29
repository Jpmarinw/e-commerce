const { expressjwt: expressJwt } = require("express-jwt");

function authJwt() {
  const segredo = process.env.segredo;
  const api = process.env.API_URL;

  return expressJwt({
    secret: segredo,
    algorithms: ["HS256"],
    isRevoked: isRevoked,
  }).unless({
    // DEFININDO APIs QUE O USUÁRIO PODE USAR SEM ESTAR AUTENTICADO NO SISTEMA
    path: [
      { url: /\/api\/v1\/produtos(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/categorias(.*)/, methods: ["GET", "OPTIONS"] },
      `${api}/usuarios/login`,
      `${api}/usuarios/cadastro`,
    ],
  });
}

// FUNÇÃO PARA APENAS ADMINS PODEREM USAR APIs DO TIPO POST, PUT E DELETE
async function isRevoked(req, jwt) {
  const payload = jwt.payload;
  return !payload.isAdmin;
}

module.exports = authJwt;
