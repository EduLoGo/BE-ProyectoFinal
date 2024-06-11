import { Router } from "express";
import CartManager from "../cartManager.js";
import ProductManager from "../productManager.js";

const router = Router();

const cartManager = new CartManager("./src/db/carts.json");
const managerProduct = new ProductManager("./src/db/products.json");

router.post("/", async (req, res) => {
  try {
    const cart = await cartManager.createCart();
    console.log(cart);
    res.status(200).json({
      status: "Success",
      message: "Cart created successfully",
      payload: cart,
    });
  } catch (error) {
    res.status(404).json({
      status: `An error occurred`,
      message: error.message,
      payload: [],
    });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartManager.getCartById(cid);
    if (!cart) {
      throw new Error(`Cart ID ${cid} not found`);
    }
    res.status(200).json({
      status: "Success",
      message: `Showing Cart #${cid}`,
      payload: cart,
    });
  } catch (error) {
    res.status(404).json({
      status: `An error occurred`,
      message: error.message,
      payload: [],
    });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartManager.getCartById(cid);
    const product = await managerProduct.getProductById(pid);
    const productOnCart = cart.products.findIndex(
      (product) => product.idProduct === parseInt(pid)
    );
    if (productOnCart !== -1) {
      cart.products[productOnCart].quantity += 1;
      const finalCart = await cartManager.updateCart(cid, cart);
      res.status(200).json({
        status: "Success",
        message: `Existing product #${pid}, quantity is updated`,
        payload: finalCart,
      });
    } else {
      const newItem = { idProduct: product.id, quantity: 1 };
      cart.products.push(newItem);
      const finalCart = await cartManager.updateCart(cid, cart);
      res.status(200).json({
        status: "Success",
        message: `Product #${pid} added to Cart #${cid}`,
        payload: finalCart,
      });
    }
  } catch (error) {
    res.status(404).json({
      status: `An error occurred`,
      message: error.message,
      payload: [],
    });
  }
});
export default router;
