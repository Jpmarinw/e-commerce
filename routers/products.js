const {Product} = require('../models/product');
const {Category} = require('../models/category');
const express = require('express');
const router = express.Router();

// TRAZER A LISTA DE PRODUTOS
router.get(`/`, async (req, res) => {
    const productList = await Product.find();

    if(!productList) {
        res.status(500).json({sucess: false})
    }
    res.send(productList);
})

// ADICIONAR UM PRODUTO
router.post(`/`, async (req, res) => {
    try {
        const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send('Categoria inválida!');

    const product = new Product({
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
        isFeature: req.body.isFeature
    })

    const savedProduct = await product.save();

    if (!savedProduct)
        return res.status(400).send('O produto não foi criado')
    res.send(product)
    }catch (error) {
        res.status(500).send('Erro no servidor: ${error.message}');
    }
    
})

// DELETAR UM PRODUTO
router.delete('/:id', (req, res)=>{
    Product.findByIdAndDelete(req.params.id).then(product => {
        if (product) {
            return res.status(200).json({sucess: true, message: 'O produto foi deletado com sucesso!'})
        } else {
            return res.status(404).json({sucess: false, message: 'O produto não foi encontrado!'})
        }
    }).catch(err=>{
        return res.status(400).json({sucess: false, error: err})
    })
})

module.exports = router;