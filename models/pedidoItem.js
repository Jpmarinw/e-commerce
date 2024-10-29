const mongoose = require("mongoose");

const pedidoItemSchema = mongoose.Schema({
  quantidade: {
    type: Number,
    required: true,
  },
  produto: {
    type: mongoose.Schema.ObjectId,
    ref: "Produto",
  },
});

exports.PedidoItem = mongoose.model("PedidoItem", pedidoItemSchema);
