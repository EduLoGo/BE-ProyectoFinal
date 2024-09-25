import productsRepository from "../repositories/products.repository.js";
import { validateId } from "../utils/validateID.js";
import ProductDTO from "../dto/product.dto.js";

class ProductsService {
  async getProductById(id) {
    validateId(id);
    const product = await productsRepository.getProductById(id);
    if (!product) {
      throw new Error(`Product ID ${id} not found`);
    }
    const productResult = new ProductDTO(product);
    return productResult;
  }
  async getProductsPaginate(limit, page, sort, filter) {
    const result = await productsRepository.getProductsPaginate(
      limit,
      page,
      sort,
      filter
    );
    return {
      products: result.docs.map((doc) => new ProductDTO(doc)),
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      prevLink: result.hasPrevPage
        ? `/api/products/?page=${result.prevPage}&limit=${limit}`
        : null,
      nextLink: result.hasNextPage
        ? `/api/products/?page=${result.nextPage}&limit=${limit}`
        : null,
    };
  }
  async addProduct(product) {
    const fullProduct = { ...product, status: true };
    const newProduct = new ProductDTO(
      await productsRepository.addProduct(fullProduct)
    );
    return newProduct;
  }
  async updateProduct(id, product) {
    validateId(id);
    const updatedProduct = await productsRepository.updateProduct(id, product);
    if (!updatedProduct) {
      throw new Error(`Product ID ${id} not found`);
    }
    const result = new ProductDTO(updatedProduct);
    return updatedProduct;
  }
  async deleteProduct(id) {
    validateId(id);
    const delProduct = await productsRepository.deleteProduct(id);
    if (!delProduct) {
      throw new Error(`Product ID ${id} not found`);
    }
    const deletedProduct = new ProductDTO(delProduct);
    return deletedProduct;
  }
}

export default new ProductsService();
