import { Router } from "express";
import { MongoProducts } from "../dao/db/mongoProducts.js";

const productManager = new MongoProducts();

const productsRouter = Router();

// Muestra de a 10 productos por paginas por defecto, recibe limit, page, sort y query
productsRouter.get("/", async (req, res) => {
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
    const productsFound = await productManager.productPaginate(
      limit,
      page,
      sort,
      filter
    );
    res.status(200).json({
      status: `Success`,
      payload: productsFound.docs,
      totalPages: productsFound.totalPages,
      prevPage: productsFound.prevPage,
      nextPage: productsFound.nextPage,
      page: productsFound.page,
      hasPrevPage: productsFound.hasPrevPage,
      hasNextPage: productsFound.hasNextPage,
      prevLink: productsFound.hasPrevPage ? `/api/products/?page=${productsFound.prevPage}&limit=${limit}` : null,
      nextLink: productsFound.hasNextPage ? `/api/products/?page=${productsFound.nextPage}&limit=${limit}` : null,
    });
  } catch (error) {
    res.status(400).json({
      status: `Error`,
      message: `An error has occurred: ` + error.message,
      payload: {},
    });
  }
});

// Devuelve producto solicitado por ID
productsRouter.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const productFound = await productManager.productById(pid);
    if (!productFound) {
      res.status(404).json({
        status: `Error`,
        message: `Product ID ${pid} not found:` + error.message,
        payload: {},
      });
    } else {
      res.status(200).json({
        status: `Success`,
        message: `Product ID ${pid} found!`,
        payload: productFound,
      });
    }
  } catch (error) {
    res.status(400).json({
      status: `Error`,
      message: `An error has occurred: ` + error.message,
      payload: {},
    });
  }
});

// Guarda Producto recibido por Body
productsRouter.post("/", async (req, res) => {
  try {
    const newProduct = req.body;
    const addedProduct = await productManager.productAdd(newProduct);
    res.status(201).json({
      status: `Success`,
      message: `Product added successfully`,
      payload: addedProduct,
    });
  } catch (error) {
    res.status(400).json({
      status: `Error`,
      message: `An error has occurred: ` + error.message,
      payload: {},
    });
  }
});

// Actualiza los datos de un producto
productsRouter.put("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const newInfo = req.body;
    const updatedProduct = await productManager.productUpdate(pid, newInfo);
    if (!updatedProduct) {
      res.status(404).json({
        status: `Error`,
        message: `Product ID ${pid} not found!`,
        payload: {},
      });
    } else {
      res.status(200).json({
        status: `Success`,
        message: `Product ID ${pid} updated successfully`,
        payload: updatedProduct,
      });
    }
  } catch (error) {
    res.status(400).json({
      status: `Error`,
      message: `An error has occurred: ` + error.message,
      payload: {},
    });
  }
});

// Elimina un producto
productsRouter.delete("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const deletedProduct = await productManager.productDelete(pid);
    if (!deletedProduct) {
      res.status(404).json({
        status: `Error`,
        message: `Product ID ${pid} not found!`,
        payload: {},
      });
    } else {
      res.status(200).json({
        status: `Success`,
        message: `Product ID ${pid} deleted successfully`,
        payload: deletedProduct,
      });
    }
  } catch (error) {
    res.status(400).json({
      status: `Error`,
      message: `An error has occurred: ` + error.message,
      payload: {},
    });
  }
});

export default productsRouter;
