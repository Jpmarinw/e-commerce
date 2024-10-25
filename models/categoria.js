const mongoose = require("mongoose");

const categoriaSchema = mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  cor: {
    type: String,
    default: "",
  },
  icon: {
    type: String,
    default: "",
  },
  imagem: {
    type: String,
    default: "",
  },
});

exports.Categoria = mongoose.model("Categoria", categoriaSchema);
