const mongoose = require("mongoose");

const pedidoSchema = mongoose.Schema({
  itensPedido: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "PedidoItem",
      required: true,
    },
  ],
  enderecoEnvio1: {
    type: String,
    required: true,
  },
  enderecoEnvio2: {
    type: String,
  },
  cidade: {
    type: String,
    required: true,
  },
  cep: {
    type: String,
    required: true,
  },
  pais: {
    type: String,
    required: true,
  },
  telefone: {
    type: String,
    required: true,
  },
  precoTotal: {
    type: Number,
  },
  usuario: {
    type: mongoose.Schema.ObjectId,
    ref: "Usuario",
  },
  status: {
    type: String,
    required: true,
    default: "Pendente",
  },
  dataPedido: {
    type: Date,
    default: Date.now,
  },
});

pedidoSchema.virtual("id").get(function () {
    return this._id.toHexString();
  });
  
  pedidoSchema.set("toJSON", {
    virtuals: true,
  });

exports.Pedido = mongoose.model("Pedido", pedidoSchema);
