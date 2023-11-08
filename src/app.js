import express from "express";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productsRouter);
app.use("/api/carts/", cartsRouter);

app.listen(PORT, () => {
  console.log(
    `Servidor corriendo en el puerto ${PORT} - Link: http://localhost:${PORT}`
  );
});

app.get("/*", (req, res) => {
  res.status(404).json({
    status: "Error 404",
    error: "Page not found",
    payload: {},
  });
});