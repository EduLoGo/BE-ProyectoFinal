import CartModel from "../dao/models/carts.model.js";

class CartDao {
  async cartCreate() {
    const newCart = await CartModel.create({});
    return newCart;
  }
  async cartById(id) {
    const cartId = await CartModel.findById(id)
      .populate("products.product")
      .lean();
    return cartId;
  }
  async cartUpdate(id, cart) {
    const cartId = await CartModel.findByIdAndUpdate(id, cart, {
      new: true,
    });
    return cartId;
  }

  async cartUpdateArray(id, cart) {
    const cartId = await CartModel.findByIdAndUpdate(
      id,
      { products: cart },
      { new: true }
    );
    return cartId;
  }

  async cartEmpty(id) {
    const cartId = await this.cartById(id);
    cartId.products = [];
    await CartModel.findByIdAndUpdate(id, cartId);
    const updateCart = await this.cartById(id);
    return updateCart;
  }

  async cartDelProduct(idCart, idProduct) {}
}

export default new CartDao();
