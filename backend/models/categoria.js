const mongoose = require("mongoose");

const categoriaSchema = mongoose.Schema({
  nome: {
    type: String,
    required: true,
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
