import { Router } from "express";
import { socketServer } from "../app.js";
import { MongoProducts } from "../dao/db/mongoProducts.js";
import { MongoCarts } from "../dao/db/mongoCarts.js";
import jwt from "jsonwebtoken";
import passport from "passport";

const router = Router();
const managerProduct = new MongoProducts();
const managerCart = new MongoCarts();

router.get("/", (req, res) => {
  res.status(200).render("index", {
    pageTitle: "CoderHouse Project",
  });
});

router.get("/login", (req, res) => {
  res.status(200).render("login", {
    pageTitle: "Iniciar Sesión",
  });
});

router.get("/register", (req, res) => {
  res.status(200).render("register", {
    pageTitle: "Crear Usuario",
  });
});

router.get("/profile", async (req, res) => {
  try {
    const token = req.cookies["coderCookieToken"];
    if (!token) {
      res.redirect("/login");
    }
    const dataCookie = jwt.verify(token, "coderhouse");
    res.render("current", {
      pageTitle: "Mi Perfil",
      user: dataCookie.payload,
    });
  } catch (error) {}
});

router.get("/products", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const sort = req.query.sort || null;
    const query = req.query.query || null;
    const filter = {};
    if (query) {
      if (!isNaN(query)) {
        filter.$or = [
          {
            stock: !isNaN(query)
              ? parseInt(query)
              : { $regex: new RegExp(query, "i") },
          },
        ];
      } else {
        filter.$or = [{ category: { $regex: new RegExp(query, "i") } }];
      }
    }
    const dbProducts = await managerProduct.getProductsPaginate(
      limit,
      page,
      sort,
      filter
    );
    res.status(200).render("products", {
      pageTitle: "CoderHouse Project",
      dbProducts: dbProducts.docs,
      hasPrevPage: dbProducts.hasPrevPage,
      hasNextPage: dbProducts.hasNextPage,
      prevPage: dbProducts.prevPage,
      nextPage: dbProducts.nextPage,
      totalPages: dbProducts.totalPages,
      currentPage: dbProducts.page,
      prevLink: dbProducts.hasPrevPage
        ? `?page=${dbProducts.prevPage}&limit=${limit}`
        : null,
      nextLink: dbProducts.hasNextPage
        ? `?page=${dbProducts.nextPage}&limit=${limit}`
        : null,
    });
  } catch (error) {
    res.status(404).render("products", {
      pageTitle: "Error 404",
      msg: error.message,
    });
  }
});

router.get("/products/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await managerProduct.getProductById(pid);
    res.status(200).render("productsDetails", {
      pageTitle: product.title,
      product,
    });
  } catch (error) {
    res.status(404).render("productsDetails", {
      pageTitle: "Error 404",
      msg: error.message,
    });
  }
});

router.get("/carts/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await managerCart.cartById(cid);
    if (!cart) {
      throw new Error(`Cart ID ${cid} not found`);
    }
    res.status(200).render("cart", {
      pageTitle: `Cart`,
      products: cart.products,
    });
  } catch (error) {
    res.status(404).render("cart", {
      pageTitle: "Cart not found",
      msg: error.message,
    });
  }
});

router.get("/chatroom", (req, res) => {
  res.status(200).render("chat", {
    pageTitle: "ChatRoom",
  });
});

router.get(
  "/realtimeproducts",
  passport.authenticate("current", { session: false }),
  async (req, res) => {
    try {
      const user = req.user.payload;
      const dbProducts = await managerProduct.getProducts();
      res.status(200).render("realtimeproducts", {
        pageTitle: "CoderHouse Project",
        dbProducts,
        userAdmin: user.role === "admin" ? true : false,
      });
    } catch (error) {
    }
  }
);

router.post("/realtimeproducts", async (req, res) => {
  try {
    const { title, description, price, category, thumbnail, code, stock } =
      req.body;
    const product = {
      title,
      description,
      price,
      category,
      thumbnail: [thumbnail],
      code,
      stock,
      status: true,
    };
    const newProduct = await managerProduct.addProduct(product);
    socketServer.emit("renderProducts", newProduct);
  } catch (error) {}
});

router.delete("/realtimeproducts", async (req, res) => {
  try {
    socketServer.on("deleteProduct", (id) => {
      console.log(id);
    });
  } catch (error) {}
});

export default router;
