import { Router } from "express";
import { socketServer } from "../app.js";
import { MongoProducts } from "../dao/db/mongoProducts.js";
import { MongoCarts } from "../dao/db/mongoCarts.js";

const productManager = new MongoProducts();
const cartsManager = new MongoCarts();

const viewsRouters = Router();

// Vista principal
viewsRouters.get("/", async (req, res) => {
  try {
    const dataDB = await productManager.productAll();
    res.render("home", { dataDB });
  } catch (error) {
    throw new Error(error.message);
  }
});

// Vista del Chat
viewsRouters.get("/chatroom", (req, res) => {
  res.status(200).render("chat");
});

// Vista de Productos Paginados
viewsRouters.get("/products", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const sort = req.query.sort || null;
    const query = req.query.query || null;
    const filter = {};
    if (query) {
      if (!isNaN(query)) { filter.$or = [
          {
            stock: !isNaN(query) ? parseInt(query) : { $regex: new RegExp(query, "i") },
          },
        ];
      } else {
        filter.$or = [{ category: { $regex: new RegExp(query, "i") } }];
      }
    }
    const productsResult = await productManager.productPaginate(
      limit,
      page,
      sort,
      filter
    );
    let { totalPages, hasNextPage, hasPrevPage, prevPage, nextPage } =
      productsResult;
    res.render("products", {
      products: productsResult.docs,
      totalPages,
      hasNextPage,
      hasPrevPage,
      prevPage,
      nextPage,
      limit,
      sort,
      query,
    });
  } catch (error) {
    throw new Error(error.message);
  }
});

// Vista de Detalle del Producto
viewsRouters.get("/products/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productManager.productById(pid);
    res.render("details", { product });
  } catch (error) {
    throw new Error(error.message);
  }
});

// Vista del Carrito
viewsRouters.get("/carts/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartsManager.cartById(cid);
    res.render("cart", { cart });
  } catch (error) {
    throw new Error(error.message);
  }
});

// Vista de Productos donde se puede cargar un nuevo por Form
viewsRouters.get("/realtimeproducts", async (req, res) => {
  try {
    const dataDB = await productManager.productAll();
    res.render("realTimeProducts", { dataDB });
  } catch (error) {
    throw new Error(error.message);
  }
});

// Guarda producto del Form y emite por socket el nuevo producto
viewsRouters.post("/realtimeproducts", async (req, res) => {
  try {
    const newProduct = req.body;
    const productAdded = await productManager.productAdd(newProduct);
    socketServer.emit("products", productAdded);
  } catch (error) {
    throw new Error(error.message);
  }
});

export default viewsRouters;
