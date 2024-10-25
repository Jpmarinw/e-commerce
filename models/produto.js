const mongoose = require("mongoose");
const moment = require("moment-timezone");

const produtoSchema = mongoose.Schema({
  nome: {
    type: String,
    require: true,
  },
  descricao: {
    type: String,
    require: true,
  },
  descDetalhada: {
    type: String,
    default: "",
  },
  imagens: [
    {
      type: String,
    },
  ],
  marca: {
    type: String,
    default: "",
  },
  preco: {
    type: Number,
    default: 0,
  },
  categoria: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Categoria",
    required: true,
  },
  imagem: {
    type: String,
    default: "",
  },
  qtdeEstoque: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
  },
  avaliacao: {
    type: Number,
    default: 0,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
  isDestaque: {
    type: Boolean,
    default: false,
  },
  dataCriacao: {
    type: Date,
    default: () => moment().tz("America/Manaus").toDate(),
  },
});

// SE EU QUISER EXCLUR O _ID DA VISUALIZAÇÃO DO JSON
/*produtoSchema.virtual("id").get(function () {
  return this._id ? this._id.toHexString() : null;
});

produtoSchema.set("toJSON", {
  virtuals: true, // Inclui campos virtuais na conversão para JSON
  versionKey: false, // Remove o campo __v
  transform: function (doc, ret) {
    delete ret._id; // Remove o campo _id do resultado JSON
  },
});*/

// ADICIONA UM VIRTUAL ID
produtoSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

produtoSchema.set("toJSON", {
  virtuals: true,
});

exports.Produto = mongoose.model("Produto", produtoSchema);
