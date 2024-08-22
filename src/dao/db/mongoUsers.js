import MongoManager from "./mongoManager.js";
import { userSchema } from "./models/users.model.js";

export class MongoUsers extends MongoManager {
  constructor() {
    super("users", userSchema);
  }
}
