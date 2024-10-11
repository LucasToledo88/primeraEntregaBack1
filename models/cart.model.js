import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "products", required: true },
      quantity: { type: Number, required: true, default: 0 },
      price: { type: Number, required: true, default: 0 }
    }
  ]
});

//usamos populate para agregar los productos desde la base de datos al array de productos en el carro:
cartSchema.pre('find', function(){
  this.populate('products.product');
});

// Middleware pre que realiza la población automáticamente
cartSchema.pre('findOne', function (next) {
  this.populate('products.product');
  next();
});

// Middleware pre que realiza la población automáticamente
cartSchema.pre('findById', function (next) {
  this.populate('products.product');
  next();
});

const CartModel = mongoose.model("carts", cartSchema);

export default CartModel;

