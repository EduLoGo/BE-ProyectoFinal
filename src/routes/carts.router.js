import { Router } from "express";
import cartsController from "../controllers/carts.controller.js";

const router = Router();

router.post("/", cartsController.cartCreate);
router.get("/:cid", cartsController.cartById);
router.post("/:cid/product/:pid", cartsController.cartAddProduct);
router.delete("/:cid/product/:pid", cartsController.cartDeleteProduct);
router.put("/:cid", cartsController.cartUpdateArray);
router.put("/:cid/product/:pid", cartsController.cartUpdateQuantity);
router.delete("/:cid", cartsController.cartEmpty);
router.get("/:cid/purchase", cartsController.cartPurchase);

export default router;
