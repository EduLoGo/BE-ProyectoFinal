class CartDTO {
  constructor(cart) {
    this.id = cart._id;
    this.products = cart.products.map((item) => ({
      productId: item.product._id,
      title: item.product.title,
      price: item.product.price,
      quantity: item.quantity,
    }));
  }
}

export default CartDTO;
