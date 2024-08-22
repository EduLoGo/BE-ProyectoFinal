import { Router } from "express";
import passport from "passport";
import { createHash, isValidPassword } from "../utils/hashbcrypt.js";
import jwt from "jsonwebtoken";
import { MongoUsers } from "../dao/db/mongoUsers.js";
import { MongoCarts } from "../dao/db/mongoCarts.js";

const userManager = new MongoUsers();
const cartManager = new MongoCarts();

const router = Router();

router.post("/register", async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;
  try {
    const existeUser = await userManager.userExist(email);
    if (existeUser) {
      return res.status(400).json({ error: "User already exists" });
    }
    // Crear el usuario.
    const newUser = {
      first_name,
      last_name,
      email,
      age,
      password: createHash(password),
      cartId: await cartManager.createCart(),
    };
    const result = await userManager.userCreate(newUser);
    const payload = {
      first_name: result.first_name,
      last_name: result.last_name,
      age: result.age,
      email: result.email,
      role: result.role,
      cartId: result.cartId,
    };
    const token = jwt.sign({ payload }, "coderhouse", { expiresIn: "1h" });
    res.cookie("coderCookieToken", token, {
      maxAge: 1000 * 60 * 60,
      httpOnly: true,
    });

    res.redirect("/api/sessions/current");
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Internal server error", error: error.message });
  }
});

// login

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    //buscamos el usuario en la base de datos
    const result = await userManager.userExist(email);

    //verificamos si el usuario existe
    if (!result) {
      return res.status(401).send({ error: `User ${email} not found` });
    }

    //validamos la contraseña
    if (!isValidPassword(password, result)) {
      return res.status(401).send({ error: "Password Incorrect" });
    }
    const payload = {
      first_name: result.first_name,
      last_name: result.last_name,
      age: result.age,
      email: result.email,
      role: result.role,
      cartId: result.cartId,
    };
    // generamos token
    const token = jwt.sign({payload},"coderhouse",{expiresIn: "1h",});

    // generamos la cookie
    res.cookie("coderCookieToken", token, {
      maxAge: 1000 * 60 * 60,
      httpOnly: true,
    });

    res.redirect("/api/sessions/current");
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Internal server error", error: error.message });
  }
});

router.get("/current", passport.authenticate("current", { session: false }), (req, res) => {
  if (req.user) {
      res.render("current", {
        user: req.user.payload,
      });
    } else {
      res.status(401).send({ error: "Unauthorized" });
    }
  }
);

// logout
router.post("/logout", (req, res) => {
  res.clearCookie("coderCookieToken");
  res.redirect("/");
});

export default router;
