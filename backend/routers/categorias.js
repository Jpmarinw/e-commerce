const { Categoria } = require("../models/categoria");
const express = require("express");
const router = express.Router();

// TRAZER A LISTA DE CATEGORIAS
router.get(`/`, async (req, res) => {
  const categoriaList = await Categoria.find();

  if (!categoriaList) {
    res.status(500).json({ sucess: false });
  }
  res.status(200).send(categoriaList);
});

// TRAZER UMA CATEGORIA PELO ID
router.get("/:id", async (req, res) => {
  const categoria = await Categoria.findById(req.params.id);

  if (!categoria) {
    res.status(500).json({
      message: "A categoria com o ID informado não foi encontrado",
    });
  }
  res.status(200).send(categoria);
});

// ADICIONAR UMA CATEGORIA
router.post("/", async (req, res) => {
  let categoria = new Categoria({
    nome: req.body.nome,
    icon: req.body.icon,
    cor: req.body.cor,
  });
  categoria = await categoria.save();

  if (!categoria) return res.status(404).send("A categoria não foi criada!");
  res.send(categoria);
});

// ALTERAR UMA CATEGORIA
router.put("/:id", async (req, res) => {
  const categoria = await Categoria.findByIdAndUpdate(
    req.params.id,
    {
      nome: req.body.nome,
      icon: req.body.icon,
      cor: req.body.cor,
      imagem: req.body.imagem,
    },
    { new: true }
  );

  if (!categoria) return res.status(400).send("A categoria não foi criada!");
  res.send(categoria);
});

//DELETAR UMA CATEGORIA
router.delete("/:id", (req, res) => {
  Categoria.findByIdAndDelete(req.params.id)
    .then((categoria) => {
      if (categoria) {
        return res.status(200).json({
          sucess: true,
          message: "A categoria foi deletada com sucesso!",
        });
      } else {
        return res
          .status(404)
          .json({ sucess: false, message: "A categoria não foi encontrada!" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ sucess: false, error: err });
    });
});

module.exports = router;
