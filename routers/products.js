const { Product } = require("../models/product");
const { Category } = require("../models/category");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// TRAZER A LISTA DE PRODUTOS
router.get(`/`, async (req, res) => {
  const productList = await Product.find()
    .select("nome imagem category -_id")
    .populate("category");

  if (!productList) {
    res.status(500).json({ sucess: false });
  }
  res.send(productList);
});

// TRAZER UM PRODUTO APENAS
router.get(`/:id`, async (req, res) => {
  const product = await Product.findById(req.params.id).populate("category");

  if (!product) {
    res.status(500).json({ sucess: false });
  }
  res.send(product);
});

// ADICIONAR UM PRODUTO
router.post(`/`, async (req, res) => {
  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send("Categoria inválida!");

  let product = new Product({
    nome: req.body.nome,
    description: req.body.description,
    richDescription: req.body.richDescription,
    imagem: req.body.imagem,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    qtdeEstoque: req.body.qtdeEstoque,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
  });

  const savedProduct = await product.save();

  if (!savedProduct) return res.status(400).send("O produto não foi criado");
  res.send(product);
});

// ALTERAR UM PRODUTO
router.put("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).send("ID do produto é inválido");
  }
  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send("Categoria inválida!");

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      nome: req.body.nome,
      description: req.body.description,
      richDescription: req.body.richDescription,
      imagem: req.body.imagem,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      qtdeEstoque: req.body.qtdeEstoque,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    },
    { new: true }
  );

  if (!product) return res.status(400).send("O produto não foi criado!");
  res.send(product);
});

// DELETAR UM PRODUTO
router.delete("/:id", (req, res) => {
  Product.findByIdAndDelete(req.params.id)
    .then((product) => {
      if (product) {
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
router.get('/get/count', async (req, res) => {
    try {
      const productCount = await Product.countDocuments();
  
      if (productCount === 0) {
        return res.status(404).json({ success: false, message: 'Nenhum produto encontrado' });
      }
  
      res.status(200).json({ quantidade: productCount });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
  

module.exports = router;
