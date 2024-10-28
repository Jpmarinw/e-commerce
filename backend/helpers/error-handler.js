function errorHandler(err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ mensagem: "O usuário não está autorizado" });
  } else {
    next();
  }

  if (err.name === "ValidationError") {
    return res.status(401).json({ mensagem: err });
  }

  return res.status(500).json();
}

module.exports = errorHandler;