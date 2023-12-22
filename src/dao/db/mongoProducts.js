import { MongoManager } from "./mongoManager.js";
import { productSchema } from "../db/models/products.model.js";

export class MongoProducts extends MongoManager {
  constructor() {
    super("products", productSchema);
  }
}
