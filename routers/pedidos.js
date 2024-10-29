const { Pedido } = require("../models/pedido");
const { PedidoItem } = require("../models/pedidoItem");
const express = require("express");
const router = express.Router();

// TRAZER A LISTA DE PEDIDOS
router.get(`/`, async (req, res) => {
  const pedidosList = await Pedido.find()
    .populate("usuario", "nome")
    .sort({ dataPedido: -1 });

  if (!pedidosList) {
    res.status(500).json({ sucess: false });
  }
  res.send(pedidosList);
});

// TRAZER UM PEDIDO APENAS
router.get(`/:id`, async (req, res) => {
  const pedido = await Pedido.findById(req.params.id)
    .populate("usuario", "nome")
    .populate({
      path: "itensPedido",
      populate: { path: "produto", populate: "categoria" },
    });

  if (!pedido) {
    res.status(500).json({ sucess: false });
  }
  res.send(pedido);
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

// DELETAR UM PEDIDO
router.delete("/:id", (req, res) => {
  Pedido.findByIdAndDelete(req.params.id)
    .then((pedido) => {
      if (pedido) {
        return res.status(200).json({
          sucess: true,
          message: "O pedido foi deletado com sucesso!",
        });
      } else {
        return res
          .status(404)
          .json({ sucess: false, message: "O pedido não foi encontrado!" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ sucess: false, error: err });
    });
});

module.exports = router;
