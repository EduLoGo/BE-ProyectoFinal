import { Router } from "express";
import passport from "passport";
import viewsControllers from "../controllers/views.controllers.js";
import { adminCheck, userCheck } from "../middleware/auth.js";

const router = Router();

router.get("/", viewsControllers.index);
router.get("/login", viewsControllers.login);
router.get("/register", viewsControllers.register);
router.get("/profile", passport.authenticate("current", { session: false }), viewsControllers.profile);
router.get("/products", viewsControllers.products);
router.get("/products/:pid", viewsControllers.productID);
router.get("/carts/:cid", viewsControllers.cartsID);
router.get("/chatroom", viewsControllers.chatroom);
router.get("/realtimeproducts", passport.authenticate("current", { session: false }), adminCheck, viewsControllers.realtimeproducts);
router.post("/realtimeproducts", viewsControllers.postRealtimeproducts);
router.delete("/realtimeproducts", viewsControllers.deleteRealtimeproducts);

export default router;
