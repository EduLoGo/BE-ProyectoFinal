import productsService from "../services/products.service.js";

class ProductsController {
  async getProducts(req, res) {
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
      const productsFound = await productsService.getProductsPaginate(
        limit,
        page,
        sort,
        filter
      );
      res.status(200).json({
        status: `Success`,
        msg: `Products found successfully`,
        payload: productsFound,
      });
    } catch (error) {
      res.status(400).json({
        status: `Error`,
        message: `An error has occurred: ${error.message}`,
        payload: {},
      });
    }
  }
  async getProductById(req, res) {
    try {
      const { id } = req.params;
      const product = await productsService.getProductById(id);
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
  }
  async addProduct(req, res) {
    try {
      const result = await productsService.addProduct(req.body);
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
  }
  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const newData = req.body;
      const result = await productsService.updateProduct(id, newData);
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
  }
  async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      const result = await productsService.deleteProduct(id);
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
  }
}

export default new ProductsController();
