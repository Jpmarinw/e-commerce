const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    nome: String,
    imagem: String,
    qtdeEstoque: {
        type: Number,
        required: true
    }
})

exports.User = mongoose.model('User', userSchema);