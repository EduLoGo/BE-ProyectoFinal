import { Router } from "express";
import { socketServer } from "../app.js";
import ProductManager from "../productManager.js";

const router = Router();
const managerProduct = new ProductManager("./src/db/products.json");

router.get("/", async (req, res) => {
  try {
    const dbProducts = await managerProduct.getProducts();
    res.status(200).render("home", {
      pageTitle: "CoderHouse Project",
      dbProducts,
    });
  } catch (error) {
    res.status(404).render("home", {
      pageTitle: "Error 404",
      msg: error.message,
    });
  }
});

router.get("/realtimeproducts", async (req, res) => {
  try {
    const dbProducts = await managerProduct.getProducts();
    res.status(200).render("realtimeproducts", {
      pageTitle: "CoderHouse Project",
      dbProducts,
    });
  } catch (error) {}
});

router.post("/realtimeproducts", async (req, res) => {
  try {
    const { title, description, price, category, thumbnail, code, stock } =
      req.body;
    const product = {
      title,
      description,
      price,
      category,
      thumbnail: [thumbnail],
      code,
      stock,
      status: true,
    };
    const newProduct = await managerProduct.addProduct(product);
    socketServer.emit("renderProducts", newProduct);
  } catch (error) {}
});

router.delete("/realtimeproducts", async (req, res) => {
  try {
    socketServer.on("deleteProduct", (id) => {
      console.log(id)
    })
  } catch (error) {
    
  }
});

export default router;
