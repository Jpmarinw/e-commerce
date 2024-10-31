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

// TRAZER A LISTA DE PEDIDOS POR USUÁRIO
router.get(`/get/pedido-usuario/:usuarioid`, async (req, res) => {
  const usuarioPedidosList = await Pedido.find({usuario: req.params.usuarioid})
  .populate({
    path: "itensPedido",
    populate: { path: "produto", populate: "categoria" },
  })
    .sort({ dataPedido: -1 });

  if (!usuarioPedidosList) {
    res.status(500).json({ sucess: false });
  }
  res.send(usuarioPedidosList);
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

  //CALCULAR O PREÇO TOTAL DOS PRODUTOS
  const precosTotal = await Promise.all(
    itensPedidoResolved.map(async (itemPedidoId) => {
      const pedidoItem = await PedidoItem.findById(itemPedidoId).populate(
        "produto",
        "preco"
      );
      const precoTotal = pedidoItem.produto.preco * pedidoItem.quantidade;
      return precoTotal;
    })
  );

  const precoTotal = precosTotal.reduce((a, b) => a + b, 0);

  let pedido = new Pedido({
    itensPedido: itensPedidoResolved,
    enderecoEnvio1: req.body.enderecoEnvio1,
    enderecoEnvio2: req.body.enderecoEnvio2,
    cidade: req.body.cidade,
    cep: req.body.cep,
    pais: req.body.pais,
    telefone: req.body.telefone,
    precoTotal: precoTotal,
    usuario: req.body.usuario,
  });

  pedido = await pedido.save();

  if (!pedido) return res.status(404).send("O pedido não foi criado!");
  res.send(pedido);
});

// ATUALIZAR O STATUS DE UM PEDIDO
router.put("/:id", async (req, res) => {
  const pedido = await Pedido.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
    },
    { new: true }
  );
  if (!pedido) {
    return res.status(400).send("O pedido não foi encontrado");
  }
  res.send(pedido);
});

// DELETAR UM PEDIDO
router.delete("/:id", (req, res) => {
  Pedido.findByIdAndDelete(req.params.id)
    .then(async (pedido) => {
      if (pedido) {
        await pedido.itensPedido.map(async (pedidoItem) => {
          await PedidoItem.findByIdAndDelete(pedidoItem);
        });
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

// TRAZER A QUANTIDADE DE VENDAS
router.get("/get/totalvendas", async (req, res) => {
  const vendasTotais = await Pedido.aggregate([
    { $group: { _id: null, totalvendas: { $sum: "$precoTotal" } } },
  ]);

  if (!vendasTotais) {
    return res.status(400).send("A venda de pedidos não foi gerada");
  }

  res.send({ totalvendas: vendasTotais.pop().totalvendas });
});

// TRAZER A QUANTIDADE DE PEDIDOS
router.get("/get/count", async (req, res) => {
  try {
    const pedidoCount = await Pedido.countDocuments();

    if (!pedidoCount) {
      return res
        .status(404)
        .json({ success: false, message: "Nenhum pedido encontrado" });
    }

    res.status(200).json({ quantidade: pedidoCount });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
