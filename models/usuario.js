const mongoose = require("mongoose");

const usuarioSchema = mongoose.Schema({
  nome: String,
  imagem: String,
  qtdeEstoque: {
    type: Number,
    required: true,
  },
});

exports.Usuario = mongoose.model("Usuario", usuarioSchema);
