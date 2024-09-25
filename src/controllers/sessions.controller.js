import sessionsService from "../services/sessions.service.js";
import jwt from "jsonwebtoken";
import UserDTO from "../dto/user.dto.js";

class SessionsController {
  async register(req, res) {
    try {
      const { first_name, last_name, age, email, password } = req.body;
      const newUser = await sessionsService.userCreate({
        first_name,
        last_name,
        age,
        email,
        password,
      });
      const payload = {
        idUser: newUser._id,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        age: newUser.age,
        email: newUser.email,
        role: newUser.role,
        cartId: newUser.cartId,
      };
      const token = jwt.sign(payload, "coderhouse", { expiresIn: "1h" });
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

    //   const payload = {
    //     first_name: req.user.first_name,
    //     last_name: req.user.last_name,
    //     age: req.user.age,
    //     email: req.user.email,
    //     role: req.user.role,
    //     cartId: req.user.cartId,
    //   };
    //   const token = jwt.sign(payload, "coderhouse", { expiresIn: "1h" });
    //   res.cookie("coderCookieToken", token, {
    //     maxAge: 1000 * 60 * 60,
    //     httpOnly: true,
    //   });
    //   res.redirect("/api/sessions/current");
    // } catch (error) {
    //   res
    //     .status(500)
    //     .json({ msg: "Internal server error", error: error.message });
    // }
  }
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await sessionsService.userLogin(email, password);
      if (!user) {
        console.log("no hay usuario ahhhhhhhh");
      }
      const payload = {
        idUser: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        age: user.age,
        email: user.email,
        role: user.role,
        cartId: user.cartId,
      };
      const token = jwt.sign(payload, "coderhouse", { expiresIn: "1h" });
      res.cookie("coderCookieToken", token, {
        maxAge: 1000 * 60 * 60,
        httpOnly: true,
      });
      res.redirect("/api/sessions/current");
    } catch (error) {
      res.status(400).render("login", { pageTitle: "Iniciar Sesión", errorMessage: error.message });
    }
  }

  async current(req, res) {
    if (req.user) {
      const user = new UserDTO(req.user);
      res.render("current", {
        user: user,
      });
    } else {
      res.status(401).send({ error: "Unauthorizedrtyrty" });
    }
  }
  async logout(req, res) {
    res.clearCookie("coderCookieToken");
    res.redirect("/");
  }
}

export default new SessionsController();
