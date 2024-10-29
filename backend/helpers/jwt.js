const { expressjwt: expressJwt } = require("express-jwt");

function authJwt() {
  const segredo = process.env.segredo;
  const api = process.env.API_URL;

  return expressJwt({
    secret: segredo,
    algorithms: ["HS256"],
    isRevoked: isRevoked, // Referência correta para função async
  }).unless({
    path: [
      { url: /\/api\/v1\/produtos(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/categorias(.*)/, methods: ["GET", "OPTIONS"] },
      `${api}/usuarios/login`,
      `${api}/usuarios/cadastro`,
    ],
  });
}

// Ajuste para usar async/await corretamente
async function isRevoked(req, jwt) {
  const payload = jwt.payload;
  return !payload.isAdmin;
}

module.exports = authJwt;
