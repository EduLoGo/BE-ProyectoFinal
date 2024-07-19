import express from "express";
import { engine } from "express-handlebars";
import mongoose from "mongoose";
import { Server } from "socket.io";
import __dirname from "./utils.js";
import viewsRouter from "./routes/views.router.js";
import productRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";

import { MongoMessages } from "./dao/db/mongoMessages.js";
const messagesManager = new MongoMessages();

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use(express.static(__dirname + "/public"));

app.use("/", viewsRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartsRouter);

const httpServer = app.listen(port, () => {
  console.log(
    `Servidor corriendo en el puerto: ${port} - Link: http://localhost:${port}`
  );
});

export const socketServer = new Server(httpServer);

socketServer.on("connection", async (socket) => {
  console.log(`Se ha conectado un cliente - ID: ${socket.id}`);
  socketServer.emit("MsgHistory", await messagesManager.messageAll());
  socket.on("MsgNew", async (data) => {
    await messagesManager.messageSave(data);
    socketServer.emit("MsgHistory", await messagesManager.messageAll());
  });
});

// Conexión a la base de datos
try {
  await mongoose.connect(
    "mongodb+srv://edulogo:CoderCoder@coderproject.wuypshy.mongodb.net/?retryWrites=true&w=majority&appName=CoderProject",
    { dbName: "ecommerce" }
  );
  console.log(`Conectado a la base de datos correctamente`);
} catch (error) {
  console.log(`No se pudo conectar a la base de datos: ${error.message}`);
}
