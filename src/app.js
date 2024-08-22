import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import { connectionMongo } from "./utils/dbConnection.js";
import __dirname from "./utils.js";

import passport from "passport";
import initializePassport from "./config/passport.config.js";
import cookieParser from "cookie-parser";

import viewsRouter from "./routes/views.router.js";
import productRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import sessionsRouter from "./routes/sessions.router.js";

import { MongoMessages } from "./dao/db/mongoMessages.js";
const messagesManager = new MongoMessages();

const app = express();
const port = 8080;

app.engine("handlebars", engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.use(cookieParser());
app.use(passport.initialize());
initializePassport();

app.use("/", viewsRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", sessionsRouter);

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

connectionMongo();
