import ProductModel from "../dao/models/products.model.js";

class ProductDao {
  async getProductsPaginate(limit, page, sort, filter) {
    const dbData = await ProductModel.paginate(filter, {
      lean: true,
      limit: limit,
      page: page,
      sort: sort ? { price: sort === "asc" ? 1 : -1 } : undefined,
    });
    return dbData;
  }

  async getProductById(id) {
    const theProduct = await ProductModel.findById({ _id: id }).lean();
    return theProduct;
  }
  async addProduct(data) {
    const existCode = await ProductModel.findOne({ code: data.code });
    if (existCode) {
      throw new Error(`The Code ${data.code} already exists in Database`);
    }
    const newProduct = await ProductModel.create(data);
    return newProduct;
  }
  async updateProduct(id, update) {
      const theProduct = await ProductModel.findByIdAndUpdate(id, update, {
      new: true,
    });
    return theProduct;
  }
  async deleteProduct(id) {
    const theProduct = await ProductModel.findByIdAndDelete(id);
    return theProduct;
  }
}

export default new ProductDao();
