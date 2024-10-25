import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  price: { type: Number, required: true, default: 0 },
  category: { type: String, required: true },
  active: { type: Boolean, default: true },
  stock: { type: Number, required: true, default: 0 },
  thumbnail: { type: String, required: true, default: 'nuevo.jpeg' },
});

productSchema.plugin(mongoosePaginate);

const ProductModel = mongoose.model("products", productSchema);

export default ProductModel;
