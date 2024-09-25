import ProductDao from "../dao/product.dao.js";

class ProductRepository {
  async getProductById(id) {
    const product = await ProductDao.getProductById(id);
    return product;
  }

  async getProductsPaginate(limit, page, sort, filter) {
    const result = await ProductDao.getProductsPaginate(
      limit,
      page,
      sort,
      filter
    );
    return result;
  }

  async addProduct(product) {
    const newProduct = await ProductDao.addProduct(product);
    return newProduct;
  }

  async updateProduct(id, product) {
    const updatedProduct = await ProductDao.updateProduct(id, product);
    return updatedProduct;
  }

  async deleteProduct(id) {
    const deletedProduct = await ProductDao.deleteProduct(id);
    return deletedProduct;
  }
}

export default new ProductRepository();
