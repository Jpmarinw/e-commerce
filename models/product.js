const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  nome: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  richDescription: {
    type: String,
    default: "",
  },
  images: [
    {
      type: String,
    },
  ],
  brand: {
    type: String,
    default: "",
  },
  price: {
    type: Number,
    default: 0,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  imagem: {
    type: String,
    default: "",
  },
  qtdeEstoque: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
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
    default: false,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

// SE EU QUISER EXCLUR O _ID DA VISUALIZAÇÃO DO JSON
/*productSchema.virtual("id").get(function () {
  return this._id ? this._id.toHexString() : null;
});

productSchema.set("toJSON", {
  virtuals: true, // Inclui campos virtuais na conversão para JSON
  versionKey: false, // Remove o campo __v
  transform: function (doc, ret) {
    delete ret._id; // Remove o campo _id do resultado JSON
  },
});*/

// ADICIONA UM VIRTUAL ID
productSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

productSchema.set('toJSON', {
  virtuals: true,
})

exports.Product = mongoose.model("Product", productSchema);
