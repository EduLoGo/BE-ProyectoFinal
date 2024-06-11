import { Router } from "express";
import ProductManager from "../productManager.js";

const router = Router();
const managerProduct = new ProductManager("./src/db/products.json");

router.get("/", async (req, res) => {
  try {
    const { limit } = req.query;
    const products = await managerProduct.getProducts();
    if (limit) {
      const limitList = products.slice(0, limit);
      res.status(200).json({
        status: "Success",
        msg: `Showing ${limit} products`,
        payload: limitList,
      });
    } else {
      res.status(200).json({
        status: "Success",
        msg: "Showing all Products",
        payload: products,
      });
    }
  } catch (error) {
    res.status(404).json({
      status: `An error occurred`,
      msg: error.message,
      payload: [],
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await managerProduct.getProductById(id);
    res.status(200).json({
      status: "Success",
      msg: `Product with ID: ${id}`,
      payload: product,
    });
  } catch (error) {
    res.status(404).json({
      status: `An error occurred`,
      msg: error.message,
      payload: [],
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, description, price, thumbnail, code, stock } = req.body;
    const newProduct = {
      title,
      description,
      price,
      thumbnail: [thumbnail],
      code,
      stock,
      status: true,
    };
    const result = await managerProduct.addProduct(newProduct);
    if (typeof result === "string") {
      throw new Error(result);
    }
    res.status(201).json({
      status: "Success",
      msg: "Product added successfully",
      payload: result,
    });
  } catch (error) {
    res.status(404).json({
      status: `An error occurred`,
      msg: error.message,
      payload: [],
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const newData = req.body;
    const result = await managerProduct.updateProduct(id, newData);
    if (typeof result === "string") {
      throw new Error(result);
    }
    res.status(200).json({
      status: "Success",
      msg: "Product updated successfully",
      payload: result,
    });
  } catch (error) {
    res.status(404).json({
      status: `An error occurred`,
      msg: error.message,
      payload: [],
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await managerProduct.deleteProduct(id);
    if (typeof result === "string") {
      throw new Error(result);
    }
    res.status(200).json({
      status: "Success",
      msg: "Product deleted successfully",
      payload: result,
    });
  } catch (error) {
    res.status(404).json({
      status: `An error occurred`,
      msg: error.message,
      payload: [],
    });
  }
});

export default router;
