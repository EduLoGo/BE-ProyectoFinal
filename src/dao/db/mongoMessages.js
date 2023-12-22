import { MongoManager } from "./mongoManager.js";
import { messagesSchema } from "./models/messages.models.js";

export class MongoMessages extends MongoManager {
  constructor() {
    super("messages", messagesSchema);
  }
}