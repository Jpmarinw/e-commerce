const { Pedido } = require("../models/pedido");
const { PedidoItem } = require("../models/pedidoItem");
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

// CRIAR UM PEDIDO
router.post("/", async (req, res) => {
  const itensPedidoIds = Promise.all(
    req.body.itensPedido.map(async (pedidoItem) => {
      let newPedidoItem = new PedidoItem({
        quantidade: pedidoItem.quantidade,
        produto: pedidoItem.produto,
      });

      newPedidoItem = await newPedidoItem.save();

      return newPedidoItem._id;
    })
  );

  const itensPedidoResolved = await itensPedidoIds;

  let pedido = new Pedido({
    itensPedido: itensPedidoResolved,
    enderecoEnvio1: req.body.enderecoEnvio1,
    enderecoEnvio2: req.body.enderecoEnvio2,
    cidade: req.body.cidade,
    cep: req.body.cep,
    pais: req.body.pais,
    telefone: req.body.telefone,
    precoTotal: req.body.precoTotal,
    usuario: req.body.usuario,
  });

  pedido = await pedido.save();

  if (!pedido) return res.status(404).send("O pedido não foi criado!");
  res.send(pedido);
});

module.exports = router;
