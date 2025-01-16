const { Produto } = require("../models/produto");
const { Categoria } = require("../models/categoria");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const moment = require("moment-timezone");
const multer = require("multer");

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("Arquivo inválido!");

    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, "public/uploads");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(" ").join("-");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });

// TRAZER A LISTA DE PRODUTOS
router.get(`/`, async (req, res) => {
  const produtoList = await Produto.find()
    .select("nome imagem categoria _id id")
    .populate("categoria");

  if (!produtoList) {
    res.status(500).json({ sucess: false });
  }
  res.send(produtoList);
});

// TRAZER UM PRODUTO APENAS
router.get(`/:id`, async (req, res) => {
  const produto = await Produto.findById(req.params.id).populate("categoria");

  if (!produto) {
    res.status(500).json({ sucess: false });
  }
  res.send(produto);
});

// ADICIONAR UM PRODUTO
router.post(`/`, uploadOptions.single("imagem"), async (req, res) => {
  const categoria = await Categoria.findById(req.body.categoria);
  if (!categoria) return res.status(400).send("Categoria inválida!");

  const file = req.file;
  if (!file) return res.status(400).send("Sem imagens nessa requisição!");

  const fileName = req.file.filename;
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

  let produto = new Produto({
    nome: req.body.nome,
    descricao: req.body.descricao,
    descDetalhada: req.body.descDetalhada,
    imagem: `${basePath}${fileName}`,
    marca: req.body.marca,
    preco: req.body.preco,
    categoria: req.body.categoria,
    qtdeEstoque: req.body.qtdeEstoque,
    avaliacao: req.body.avaliacao,
    numReviews: req.body.numReviews,
    isDestaque: req.body.isDestaque,
  });

  const savedProduto = await produto.save();

  if (!savedProduto) return res.status(400).send("O produto não foi criado");
  res.send(produto);
});

// ALTERAR UM PRODUTO
router.put("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).send("ID do produto é inválido");
  }
  const categoria = await Categoria.findById(req.body.categoria);
  if (!categoria) return res.status(400).send("Categoria inválida!");

  const produto = await Produto.findByIdAndUpdate(
    req.params.id,
    {
      nome: req.body.nome,
      descricao: req.body.descricao,
      descDetalhada: req.body.descDetalhada,
      imagem: req.body.imagem,
      marca: req.body.marca,
      preco: req.body.preco,
      categoria: req.body.categoria,
      qtdeEstoque: req.body.qtdeEstoque,
      avaliacao: req.body.avaliacao,
      numReviews: req.body.numReviews,
      isDestaque: req.body.isDestaque,
    },
    { new: true }
  );

  if (!produto) return res.status(400).send("O produto não foi criado!");
  res.send(produto);
});

// DELETAR UM PRODUTO
router.delete("/:id", (req, res) => {
  Produto.findByIdAndDelete(req.params.id)
    .then((produto) => {
      if (produto) {
        return res.status(200).json({
          sucess: true,
          message: "O produto foi deletado com sucesso!",
        });
      } else {
        return res
          .status(404)
          .json({ sucess: false, message: "O produto não foi encontrado!" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ sucess: false, error: err });
    });
});

// TRAZER A QUANTIDADE DE PRODUTOS
router.get("/get/count", async (req, res) => {
  try {
    const produtoCount = await Produto.countDocuments();

    if (produtoCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Nenhum produto encontrado" });
    }

    res.status(200).json({ quantidade: produtoCount });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// TRAZER A QUANTIDADE DE PRODUTOS EM DESTAQUE
router.get("/get/destaque/:count", async (req, res) => {
  const count = req.params.count ? req.params.count : 0;
  const produtos = await Produto.find({ isDestaque: true }).limit(+count);

  if (!produtos) {
    res.status(500).json({ sucess: false });
  }
  res.send(produtos);
});

// TRAZER PRODUTOS POR CATEGORIA
router.get(`/`, async (req, res) => {
  let filter = {};

  if (req.query.categorias) {
    filter = req.query.categorias.split(",");
  }

  const produtoList = await Produto.find(filter).populate("categoria");

  if (!produtoList) {
    res.status(500).json({ sucess: false });
  }
  res.send(produtoList);
});

module.exports = router;
