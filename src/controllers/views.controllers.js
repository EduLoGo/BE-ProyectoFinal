import productsService from "../services/products.service.js";
import cartsService from "../services/carts.service.js";
import { socketServer } from "../app.js";

class ViewsController {
  async index(req, res) {
    res.status(200).render("index", {
      pageTitle: "CoderHouse Project",
    });
  }
  async login(req, res) {
    res.status(200).render("login", {
      pageTitle: "Iniciar Sesión",
    });
  }
  async register(req, res) {
    res.status(200).render("register", {
      pageTitle: "Crear Usuario",
    });
  }
  async profile(req, res) {
    if (!req.user) {
      res.redirect("/login");
    }
    res.render("current", {
      pageTitle: "Mi Perfil",
      user: req.user,
    });
  }
  async products(req, res) {
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
      const dbProducts = await productsService.getProductsPaginate(
        limit,
        page,
        sort,
        filter
      );
      res.status(200).render("products", {
        pageTitle: "CoderHouse Project",
        dbProducts: dbProducts.products,
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
  }
  async productID(req, res) {
    try {
      const { pid } = req.params;
      const product = await productsService.getProductById(pid);
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
  }
  async cartsID(req, res) {
    const { cid } = req.params;
    try {
      const cart = await cartsService.cartById(cid);
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
  }
  async chatroom(req, res) {
    res.status(200).render("chat", {
      pageTitle: "ChatRoom",
    });
  }
  async realtimeproducts(req, res) {
    try {
      const user = req.user;
      const dbProducts = await productsService.getProducts();
      res.status(200).render("realtimeproducts", {
        pageTitle: "CoderHouse Project",
        dbProducts,
        userAdmin: user.role === "admin" ? true : false,
      });
    } catch (error) {}
  }
  async postRealtimeproducts(req, res) {
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
      const newProduct = await productsService.addProduct(product);
      socketServer.emit("renderProducts", newProduct);
    } catch (error) {}
  }
  async deleteRealtimeproducts(req, res) {
    try {
    socketServer.on("deleteProduct", (id) => {
      console.log(id);
    });
  } catch (error) {}
  }
}

export default new ViewsController();
