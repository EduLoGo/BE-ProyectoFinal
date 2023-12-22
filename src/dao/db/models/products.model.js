import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

export const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    thumbnail: { type: Array },
    code: { type: String, required: true, unique: true },
    stock: { type: Number, required: true },
    status: { type: Boolean, default: true },
  },
  {
    timesTamps: true,
    strict: true,
  }
);

productSchema.plugin(mongoosePaginate);
