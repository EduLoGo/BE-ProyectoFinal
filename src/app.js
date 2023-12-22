import express from "express";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import { Server } from "socket.io";
import mongoose from "mongoose";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouters from "./routes/views.router.js";

import { MongoMessages } from "./dao/db/mongoMessages.js";

const messagesManager = new MongoMessages();

const app = express();
const PORT = 8080;
const httpServer = app.listen(PORT, () => {
  console.log(
    `Servidor corriendo en el puerto ${PORT} - Link: http://localhost:${PORT}`
  );
});

export const socketServer = new Server(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

app.use("/api/products", productsRouter);
app.use("/api/carts/", cartsRouter);
app.use("/", viewsRouters);

//Socket
socketServer.on("connection", async (socket) => {
  console.log(`Nuevo cliente conectado: ${socket.id}`);
  socketServer.emit("MsgHistory", await messagesManager.messageAll());
  socket.on("MsgNew", async (data) => {
    await messagesManager.messageSave(data);
    socketServer.emit("MsgHistory", await messagesManager.messageAll());
  });
});

//Error url
app.get("/*", (req, res) => {
  res.status(404).json({
    status: "Error 404",
    error: "Page not found",
    payload: {},
  });
});

// Conexión a la base de datos
try {
  await mongoose.connect(
    "mongodb+srv://edulogo:CoderCoder@coderproject.wuypshy.mongodb.net/?retryWrites=true&w=majority",
    { dbName: "ecommerce" }
  );
  console.log(`Conectado a la base de datos correctamente`);
} catch (error) {
  console.log(`No se pudo conectar a la base de datos: ${error.message}`);
}
