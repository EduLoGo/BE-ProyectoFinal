import CartDao from "../dao/cart.dao.js";

class CartsRepository {
  async cartCreate() {
    return await CartDao.cartCreate();
  }

  async cartById(id) {
    return await CartDao.cartById(id);
  }

  async cartUpdate(id, cart) {
    return await CartDao.cartUpdate(id, cart);
  }

  async cartUpdateArray(id, cart) {
    return await CartDao.cartUpdateArray(id, cart);
  }

  async cartEmpty(id) {
    return await CartDao.cartEmpty(id);
  }
}

export default new CartsRepository();