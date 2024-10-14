const {Product} = require('../models/product')
const express = require('express');
const router = express.Router();

router.get(`/`, async (req, res) => {
    const productList = await Product.find();

    if(!productList) {
        res.status(500).json({sucess: false})
    }
    res.send(productList);
})

//API Requisição POST
router.post(`/`, (req, res) => {
    const product = new Product({
        nome: req.body.nome,
        imagem: req.body.imagem,
        qtdeEstoque: req.body.qtdeEstoque
    })

    product.save().then((createdProduct => {
        res.status(201).json(createdProduct)
    })).catch((err) => {
        res.status(500).json({
            error: err,
            sucess: false
        })
    })
})

module.exports = router;