import fs from "fs";
import ProductManager from "./productManager.js";

class CartManager extends ProductManager {
  async createCart() {
    try {
      const dbCarts = await this.loadData();
      if (dbCarts.length === 0) {
        this.id = 1;
      } else {
        this.id = dbCarts[dbCarts.length - 1].id + 1;
      }
      const newCart = { id: this.id, products: [] };
      dbCarts.push(newCart);
      this.saveData(dbCarts);
      return newCart;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getCartById(id) {
    try {
      const dbCarts = await this.loadData();
      const cartExist = dbCarts.find((elem) => elem.id === parseInt(id));
      if (!cartExist) {
        throw new Error(`Cart ID ${id} not found`);
      }
      return cartExist;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateCart(id, productAdd) {
    try {
      const dbCarts = await this.loadData();
      const indexCart = dbCarts.findIndex((elem) => elem.id === parseInt(id));
      if (indexCart !== -1) {
        dbCarts[indexCart] = { ...productAdd };
        this.saveData(dbCarts);
        return dbCarts[indexCart];
      } else {
        throw new Error(`Cart ID ${id} not found`);
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export default CartManager;
