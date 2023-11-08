import { Router } from "express";
import ProductManager from "../productManager.js";

const productManager = new ProductManager("./src/productsDB.json");

const productsRouter = Router();

productsRouter.get("/", async (req, res) => {
  try {
    const limit = req.query.limit;
    const allProducts = await productManager.getProducts();
    if (!limit) {
      res.status(200).json({
        status: `Success`,
        message: "All products",
        payload: allProducts,
      });
    } else {
      const productsLimit = allProducts.slice(0, limit);
      res.status(200).json({
        status: `Success`,
        message: `Showing ${limit} products`,
        payload: productsLimit,
      });
    }
  } catch (error) {
    res.status(400).json({
      status: `Error`,
      message: "An unexpected error has occurred! Please, try again later.",
      payload: {},
    });
  }
});

productsRouter.get("/:pid", async (req, res) => {
  try {
    const id = parseInt(req.params.pid);
    const productFound = await productManager.getProductByID(id);
    if (!productFound) {
      res.status(404).json({
        status: `Error`,
        message: `Product ID ${id} not found!`,
        payload: {},
      });
    } else {
      res.status(200).json({
        status: `Success`,
        message: `Product ID ${id} found!`,
        payload: productFound,
      });
    }
  } catch {
    res.status(400).json({
      status: `Error`,
      message: "An unexpected error has occurred! Please, try again later.",
      payload: {},
    });
  }
});

productsRouter.post("/", async (req, res) => {
  try {
    const newProduct = req.body;
    const addedProduct = await productManager.addProduct(newProduct);
    res.status(201).json({
      status: `Success`,
      message: `Product added successfully`,
      payload: addedProduct,
    });
  } catch (error) {
    res.status(400).json({
      status: `Error`,
      message: error.message,
      payload: {},
    });
  }
});

productsRouter.put("/:pid", async (req, res) => {
  try {
    const id = parseInt(req.params.pid);
    const newInfo = req.body;
    const updatedProduct = await productManager.updateProduct(id, newInfo);
    if (!updatedProduct) {
      res.status(404).json({
        status: `Error`,
        message: `Product ID ${id} not found!`,
        payload: {},
      });
    } else {
      res.status(200).json({
        status: `Success`,
        message: `Product ID ${id} updated successfully`,
        payload: updatedProduct,
      });
    }
  } catch (error) {
    res.status(400).json({
      status: `Error`,
      message: "An unexpected error has occurred! Please, try again later.",
      payload: {},
    });
  }
});

productsRouter.delete("/:pid", async (req, res) => {
  try {
    const id = parseInt(req.params.pid);
    const deletedProduct = await productManager.deleteProduct(id);
    if (!deletedProduct) {
      res.status(404).json({
        status: `Error`,
        message: `Product ID ${id} not found!`,
        payload: {},
      });
    } else {
      res.status(200).json({
        status: `Success`,
        message: `Product ID ${id} deleted successfully`,
        payload: deletedProduct,
      });
    }
  } catch {
    res.status(400).json({
      status: `Error`,
      message: "An unexpected error has occurred! Please, try again later.",
      payload: {},
    });
  }
});

export default productsRouter;
