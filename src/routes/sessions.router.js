import { Router } from "express";
import passport from "passport";
import sessionController from "../controllers/sessions.controller.js";

const router = Router();

router.post("/register", sessionController.register);
router.post("/login",  sessionController.login);
router.get("/current", passport.authenticate("current", { session: false }), sessionController.current);
router.post("/logout", sessionController.logout);

export default router;
