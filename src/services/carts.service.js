import cartsRepository from "../repositories/carts.repository.js";
import { validateId } from "../utils/validateID.js";
import CartDTO from "../dto/cart.dto.js"

class CartsService {
  async cartCreate() {
    const newCart = await cartsRepository.cartCreate();
    return newCart;
  }

  async cartById(id) {
    validateId(id);
    const cartId = await cartsRepository.cartById(id);
    return cartId;
  }

  async cartUpdate(id, cart) {
    const updateCart = await cartsRepository.cartUpdate(id, cart);
    return updateCart;
  }

  async cartUpdateArray(id, cart) {
    const updateCart = await cartsRepository.cartUpdateArray(id, cart);
    return updateCart;
  }

  async cartEmpty(id) {
    validateId(id);
    const emptyCart = await cartsRepository.cartEmpty(id);
    return emptyCart;
  }
}

export default new CartsService();
