const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    nome: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    richDescription: {
        type: String,
        default: ''
    },
    images: [{
        type: String
    }],
    brand: {
        type: String,
        default: ''
    },
    price: {
        type: Number,
        default: 0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Category',
        required: true
    },
    imagem: {
        type: String,
        default: ''
    },
    qtdeEstoque: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    rating: {
        type: Number,
        default: 0,
    },
    numReviews: {
        type: Number,
        default: 0,
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    }
})

exports.Product = mongoose.model('Product', productSchema);