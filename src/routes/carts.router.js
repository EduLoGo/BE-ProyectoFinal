import { Router } from "express";
import { MongoCarts } from "../dao/db/mongoCarts.js";
import { MongoProducts } from "../dao/db/mongoProducts.js";

const cartsManager = new MongoCarts();
const productsManager = new MongoProducts();

export const cartsRouter = Router();

// Crea un nuevo carrito
cartsRouter.post("/", async (req, res) => {
  try {
    const newCart = await cartsManager.createCart();
    res.status(201).json({
      status: "Success",
      message: "Cart created successfully",
      payload: newCart,
    });
  } catch (error) {
    res.status(400).json({
      status: "Error",
      message: "The cart could not be created: " + error.message,
      payload: {},
    });
  }
});

// Obtiene el carrito por ID
cartsRouter.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await cartsManager.cartById(cid);
    if (cart) {
      res.status(200).json({
        status: "Success",
        message: `Cart ${cid} found successfully`,
        payload: cart,
      });
    } else {
      res.status(404).json({
        status: "Error",
        message: `Cart ID ${cid} not found`,
        payload: {},
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: "An unexpected error has occurred: " + error.message,
      payload: {},
    });
  }
});

// Agrega un producto al carrito y si existe, incrementa la cantidad
cartsRouter.post("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const cart = await cartsManager.cartById(cid);
    if (!cart) {
      res.status(404).json({
        status: "Error",
        message: `Cart ID ${cid} not found`,
        payload: {},
      });
    } else {
      const productExist = await productsManager.productById(pid);
      if (productExist.length !== 0) {
        const productIndexInCart = cart.products.findIndex(
          (elem) => elem.product._id.toString() === pid
        );
        if (productIndexInCart === -1) {
          cart.products.push({ product: productExist[0]._id });
          const updateCart = await cartsManager.cartUpdate(cid, cart);
          res.status(201).json({
            status: "Success",
            message: "Product added successfully",
            payload: updateCart,
          });
        } else {
          cart.products[productIndexInCart].quantity += 1;
          const funciona = await cartsManager.cartUpdate(cid, cart);
          res.status(202).json({
            status: "Success",
            message: "Existing product, quantity was increased",
            payload: funciona,
          });
        }
      } else {
        res.status(404).json({
          status: "Error",
          message: `Product ID ${pid} not found`,
          payload: {},
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message,
      payload: {},
    });
  }
});

// Elimina el producto del carrito
cartsRouter.delete("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const cart = await cartsManager.cartById(cid);
    if (!cart) {
      res.status(404).json({
        status: "Error",
        message: `Cart ID ${cid} not found`,
        payload: {},
      });
    } else {
      const productIndexInCart = cart.products.findIndex(
        (elem) => elem.product._id.toString() === pid
      );
      if (productIndexInCart === -1) {
        res.status(404).json({
          status: "Error",
          message: `Product ID ${pid} not found in cart ${cid}`,
          payload: {},
        });
      } else {
        cart.products.splice(productIndexInCart, 1);
        const updateCart = await cartsManager.cartUpdate(cid, cart);
        res.status(200).json({
          status: "Success",
          message: `Product ID ${pid} deleted from cart ${cid} successfully`,
          payload: updateCart,
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message,
      payload: {},
    });
  }
});

// Actualiza el carrito con un arreglo de productos con el formato especificado arriba
cartsRouter.put("/:cid", async (req, res) => {
  const { cid } = req.params;
  const newInfo = req.body;
  try {
    const cart = await cartsManager.cartById(cid);
    if (!cart) {
      res.status(404).json({
        status: "Error",
        message: `Cart ID ${cid} not found`,
        payload: {},
      });
    } else {
      const updateCart = await cartsManager.cartUpdateArray(cid, newInfo);
      res.status(200).json({
        status: "Success",
        message: `Cart ID ${cid} updated successfully`,
        payload: updateCart,
      });
    }
  } catch (error) {
    res.status(400).json({
      status: "Error",
      message: `An error has occurred: ` + error.message,
      payload: {},
    });
  }
});

// Actualiza la cantidad de un producto en el carrito
cartsRouter.put("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  try {
    const cart = await cartsManager.cartById(cid);
    if (!cart) {
      res.status(404).json({
        status: "Error",
        message: `Cart ID ${cid} not found`,
        payload: {},
      });
    } else {
      const productIndexInCart = cart.products.findIndex(
        (elem) => elem.product._id.toString() === pid
      );
      if (productIndexInCart === -1) {
        res.status(404).json({
          status: "Error",
          message: `Product ID ${pid} not found in cart ${cid}`,
          payload: {},
        });
      } else {
        cart.products[productIndexInCart].quantity = quantity;
        const updateCart = await cartsManager.cartUpdate(cid, cart);
        res.status(200).json({
          status: "Success",
          message: `Quantity of Product ID ${pid}, updated successfully`,
          payload: updateCart,
        });
      }
    }
  } catch (error) {
    res.status(400).json({
      status: "Error",
      message: `An error has occurred: ` + error.message,
      payload: {},
    });
  }
});

// Elimina todos los productos del carrito
cartsRouter.delete("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await cartsManager.cartById(cid);
    if (!cart) {
      res.status(404).json({
        status: "Error",
        message: `Cart ID ${cid} not found`,
        payload: {},
      });
    } else {
      const deleteCart = await cartsManager.cartDelete(cid);
      res.status(200).json({
        status: "Success",
        message: `Cart ID ${cid} deleted successfully`,
        payload: deleteCart,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message,
      payload: {},
    });
  }
});
export default cartsRouter;
