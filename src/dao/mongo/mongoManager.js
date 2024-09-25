import mongoose from "mongoose";

class MongoManager {
  constructor(collectionName, schema) {
    this.db = mongoose.model(collectionName, schema);
  }
  validateId(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("ID not valid");
    }
  }
  // async getProducts(limit) {
  //   try {
  //     const db = await this.db.find({}).limit(limit).lean();
  //     return db;
  //   } catch (error) {
  //     return `An error occurred: ${error}`;
  //   }
  // }
  // async getProductById(id) {
  //   this.validateId(id);
  //   try {
  //     const theProduct = await this.db.findById({ _id: id }).lean();
  //     return theProduct;
  //   } catch (error) {
  //     return `An error occurred: ${error}`;
  //   }
  // }
  // async addProduct(data) {
  //   const existCode = await this.db.findOne({ code: data.code });
  //   if (existCode) {
  //     return `The Code ${data.code} already exists in Database`;
  //   }
  //   try {
  //     const newProduct = await this.db.create(data);
  //     return newProduct;
  //   } catch (error) {
  //     return `An error occurred: ${error}`;
  //   }
  // }
  // async updateProduct(id, update) {
  //   this.validateId(id);
  //   try {
  //     const theProduct = await this.db.findByIdAndUpdate(id, update, {
  //       new: true,
  //     });
  //     return theProduct;
  //   } catch (error) {
  //     return `An error occurred: ${error}`;
  //   }
  // }
  // async deleteProduct(id) {
  //   this.validateId(id);
  //   try {
  //     const theProduct = await this.db.findByIdAndDelete(id);
  //     return theProduct;
  //   } catch (error) {
  //     return `An error occurred: ${error}`;
  //   }
  // }
  // async getProductsPaginate(limit, page, sort, filter) {
  //   try {
  //     const dbData = await this.db.paginate(filter, {
  //       lean: true,
  //       limit: limit,
  //       page: page,
  //       sort: sort ? { price: sort === "asc" ? 1 : -1 } : null,
  //     });
  //     return dbData;
  //   } catch (error) {
  //     return `An error occurred: ${error}`;
  //   }
  // }

  // Manejo de Carts

  // async cartCreate() {
  //   try {
  //     const newCart = await this.db.create({});
  //     return newCart;
  //   } catch (error) {
  //     throw new Error(error.message);
  //   }
  // }
  // async cartById(id) {
  //   this.validateId(id);
  //   try {
  //     const cartId = await this.db
  //       .findById(id)
  //       .populate("products.product")
  //       .lean();
  //     return cartId;
  //   } catch (error) {
  //     throw new Error(error.message);
  //   }
  // }
  // async cartUpdate(id, cart) {
  //   try {
  //     const cartId = await this.db.findByIdAndUpdate(id, cart, {
  //       new: true,
  //     });
  //     return cartId;
  //   } catch (error) {
  //     throw new Error(error.message);
  //   }
  // }

  // async cartUpdateArray(id, cart) {
  //   try {
  //     const cartId = await this.db.findByIdAndUpdate(
  //       id,
  //       { products: cart },
  //       {
  //         new: true,
  //       }
  //     );
  //     return cartId;
  //   } catch (error) {
  //     throw new Error(error.message);
  //   }
  // }

  // async cartEmpty(id) {
  //   this.validateId(id);
  //   try {
  //     const cartId = await this.cartById(id);
  //     cartId.products = [];
  //     await this.db.findByIdAndUpdate(id, cartId);
  //     const updateCart = await this.cartById(id);
  //     return updateCart;
  //   } catch (error) {
  //     throw new Error(error.message);
  //   }
  // }

  // async cartDelProduct(idCart, idProduct) {}

  /// Manejo de Usuarios

  // async userCreate(user) {
  //   try {
  //     const existMail = await this.db.findOne({ email: user.email });
  //     if (existMail) {
  //       return `The Email ${user.email} already exists in Database`;
  //     }
  //     const newUser = await this.db.create(user);
  //     return newUser;
  //   } catch (error) {
  //     throw new Error("An error occurred: ", error.message);
  //   }
  // }

  // async userExist(email) {
  //   try {
  //     const user = await this.db.findOne({ email });
  //     return user;
  //   } catch (error) {
  //     throw new Error(error.message);
  //   }
  // }

  // async userById(id) {
  //   try {
  //     const user = await this.db.findById(id);
  //     return user;
  //   } catch (error) {
  //     throw new Error(error.message);
  //   }
  // }

  /// Manejo de Mensajes

  async messageAll() {
    try {
      const dbMsg = await this.db.find({}).sort({ _id: -1 }).lean();
      return dbMsg;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async messageSave(message) {
    try {
      await this.db.create(message);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export default MongoManager;
