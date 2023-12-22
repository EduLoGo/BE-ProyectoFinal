import fs from "fs";

class CartManager {
  constructor(path) {
    this.path = path;
  }

  async loadCarts() {
    try {
      if (fs.existsSync(this.path)) {
        const cartsDB = await fs.promises.readFile(this.path, "utf-8");
        return JSON.parse(cartsDB);
      }
      console.log(this.path)
      await fs.promises.writeFile(this.path, JSON.stringify([]));
      return [];
    } catch (error) {
      throw new Error(`An unexpected error has occurred`);
    }
  }

  async createCart(cart) {
    try {
      let cartsDB = await this.loadCarts();
      let lastId =
        cartsDB.length > 0 ? cartsDB[cartsDB.length - 1].idCart + 1 : 1;
      let newCart = { idCart: lastId, products: cart };
      cartsDB.push(newCart);
      const cartsString = JSON.stringify(cartsDB, null, 2);
      await fs.promises.writeFile(this.path, cartsString);
      return newCart;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getCartById(id) {
    try {
      let cartsDB = await this.loadCarts();
      let searchId = cartsDB.find((elem) => elem.idCart === id);
      if (searchId) {
        return searchId;
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateCart(id, productAdd) {
    try {
      let cartsDB = await this.loadCarts();
      let index = cartsDB.findIndex((elem) => elem.idCart === id);
      if (index !== -1) {
        cartsDB[index] = { ...productAdd };
        const cartsString = JSON.stringify(cartsDB, null, 2);
        await fs.promises.writeFile(this.path, cartsString);
        return cartsDB[index];
      } else {
        throw new Error(error.message);
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export default CartManager;
