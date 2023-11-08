import { Router } from "express";
import CartManager from "../cartManager.js";
import ProductManager from "../productManager.js";

const productManager = new ProductManager("src/productsDB.json");
const cartManager = new CartManager("src/cartsDB.json");

export const cartsRouter = Router();

cartsRouter.post("/", async (req, res) => {
  try {
    const products = [];
    const newCart = await cartManager.createCart(products);
    res.status(201).json({
      status: "Success",
      message: "Cart created successfully",
      payload: newCart,
    });
  } catch (error) {
    res.status(400).json({
      status: "Error",
      message: "The cart could not be created",
      payload: {},
    });
  }
});

cartsRouter.get("/:cid", async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const cart = await cartManager.getCartById(cartId);
    if (cart) {
      res.status(200).json({
        status: "Success",
        message: `Cart ${cartId} found successfully`,
        payload: cart,
      });
    } else {
      res.status(404).json({
        status: "Error",
        message: `Cart ID ${cartId} not found`,
        payload: {},
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: `An unexpected error has occurred`,
      payload: {},
    });
  }
});

cartsRouter.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    const productsDB = await productManager.loadData();
    const cart = await cartManager.getCartById(cartId);
    if (!cart) {
      res.status(404).json({
        status: "Error",
        message: `Cart ID ${cartId} not found`,
        payload: {},
      });
    } else {
      const productExist = productsDB.some((elem) => elem.id === productId);
      if (productExist) {
        const productIndex = cart.products.findIndex(
          (elem) => elem.idProduct === productId
        );
        if (productIndex === -1) {
          const newProduct = { idProduct: productId, quantity: 1 };
          cart.products.push(newProduct);
          await cartManager.updateCart(cartId, cart);
          res.status(201).json({
            status: "Success",
            message: "Product added successfully",
            payload: cart,
          });
        } else {
          cart.products[productIndex].quantity += 1;
          await cartManager.updateCart(cartId, cart);
          res.status(202).json({
            status: "Success",
            message: "Existing product, quantity was increased",
            payload: cart,
          });
        }
      } else {
        res.status(404).json({
          status: "Error",
          message: `Product ID ${productId} not found`,
          payload: {},
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: `An unexpected error has occurred`,
      payload: {},
    });
  }
});

export default cartsRouter;