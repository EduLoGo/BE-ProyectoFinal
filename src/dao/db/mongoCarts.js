import { MongoManager } from "./mongoManager.js";
import { cartSchema } from "./models/carts.model.js";

export class MongoCarts extends MongoManager {
  constructor() {
    super("carts", cartSchema);
  }
}
