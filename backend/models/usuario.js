const mongoose = require("mongoose");

const usuarioSchema = mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  telefone: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  rua: {
    type: String,
    default: "",
  },
  cep: {
    type: String,
    default: "",
  },
  casa: {
    type: String,
    default: "",
  },
  cidade: {
    type: String,
    default: "",
  },
  pais: {
    type: String,
    default: "",
  },
});

usuarioSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

usuarioSchema.set("toJSON", {
  virtuals: true,
});

exports.Usuario = mongoose.model("Usuario", usuarioSchema);
exports.usuarioSchema = usuarioSchema;
