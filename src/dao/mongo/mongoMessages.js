import MongoManager from "./mongoManager.js";
import { messagesSchema } from "../models/messages.model.js";

export class MongoMessages extends MongoManager {
  constructor() {
    super("messages", messagesSchema);
  }
}
