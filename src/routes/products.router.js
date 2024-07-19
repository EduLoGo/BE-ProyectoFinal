import { Router } from "express";
import { MongoProducts } from "../dao/db/mongoProducts.js";

const router = Router();
const managerProduct = new MongoProducts();

router.get("/", async (req, res) => {
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
    const productsFound = await managerProduct.getProductsPaginate(
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
      prevLink: productsFound.hasPrevPage
        ? `/api/products/?page=${productsFound.prevPage}&limit=${limit}`
        : null,
      nextLink: productsFound.hasNextPage
        ? `/api/products/?page=${productsFound.nextPage}&limit=${limit}`
        : null,
    });
  } catch (error) {
    res.status(400).json({
      status: `Error`,
      message: `An error has occurred: ${error.message}`,
      payload: {},
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await managerProduct.getProductById(id);
    res.status(200).json({
      status: "Success",
      msg: `Product with ID: ${id}`,
      payload: product,
    });
  } catch (error) {
    res.status(404).json({
      status: `An error occurred`,
      msg: error.message,
      payload: [],
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, description, price, category, thumbnail, code, stock } =
      req.body;
    const newProduct = {
      title,
      description,
      price,
      category,
      thumbnail: [thumbnail],
      code,
      stock,
      // status: true,
    };
    const result = await managerProduct.addProduct(newProduct);
    console.log(result);
    if (typeof result === "string") {
      throw new Error(result);
    }
    res.status(201).json({
      status: "Success",
      msg: "Product added successfully.",
      payload: result,
    });
  } catch (error) {
    res.status(404).json({
      status: `An error occurred`,
      msg: error.message,
      payload: [],
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const newData = req.body;
    const result = await managerProduct.updateProduct(id, newData);
    if (typeof result === "string") {
      throw new Error(result);
    }
    res.status(200).json({
      status: "Success",
      msg: "Product updated successfully",
      payload: result,
    });
  } catch (error) {
    res.status(404).json({
      status: `An error occurred`,
      msg: error.message,
      payload: [],
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await managerProduct.deleteProduct(id);
    if (result == null) throw new Error(`Product ID: ${id} not found`);
    res.status(200).json({
      status: "Success",
      msg: "Product deleted successfully",
      payload: result,
    });
  } catch (error) {
    res.status(404).json({
      status: `An error occurred`,
      msg: error.message,
      payload: [],
    });
  }
});

export default router;
