import express from "express";
import productRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productRouter);
app.use("/api/carts", cartsRouter);

app.listen(port, () => {
  console.log(
    `Servidor corriendo en el puerto: ${port} - Link: http://localhost:${port}`
  );
});