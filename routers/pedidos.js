const { Pedido } = require("../models/pedido");
const express = require("express");
const router = express.Router();

// TRAZER A LISTA DE PEDIDOS
router.get(`/`, async (req, res) => {
  const pedidosList = await Pedido.find();

  if (!pedidosList) {
    res.status(500).json({ sucess: false });
  }
  res.send(pedidosList);
});

module.exports = router;
