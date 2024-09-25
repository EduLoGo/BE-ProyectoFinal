import cartsService from "../services/carts.service.js";
import productsService from "../services/products.service.js";

class CartsController {
  async cartCreate(req, res) {
    try {
      const newCart = await cartsService.cartCreate();
      res.status(201).json({
        status: "Success",
        message: "Cart created successfully",
        payload: newCart,
      });
    } catch (error) {
      res.status(400).json({
        status: "Error",
        message: "The cart could not be created: " + error.message,
        payload: {},
      });
    }
  }
  async cartById(req, res) {
    const { cid } = req.params;
    try {
      const cart = await cartsService.cartById(cid);
      if (cart) {
        res.status(200).json({
          status: "Success",
          message: `Cart ${cid} found successfully`,
          payload: cart,
        });
      } else {
        res.status(404).json({
          status: "Error",
          message: `Cart ID ${cid} not found`,
          payload: {},
        });
      }
    } catch (error) {
      res.status(500).json({
        status: "Error",
        message: "An error has occurred: " + error.message,
        payload: {},
      });
    }
  }
  async cartAddProduct(req, res) {
    const { cid, pid } = req.params;
    try {
      const cart = await cartsService.cartById(cid);
      if (!cart) {
        res.status(404).json({
          status: "Error",
          message: `Cart ID ${cid} not found`,
          payload: {},
        });
      } else {
        const productExist = await productsService.getProductById(pid);
        if (productExist) {
          const productIndexInCart = cart.products.findIndex(
            (elem) => elem.product._id.toString() === pid
          );
          if (productIndexInCart === -1) {
            cart.products.push({ product: productExist.id });
            const updateCart = await cartsService.cartUpdate(cid, cart);
            res.status(201).json({
              status: "Success",
              message: "Product added successfully",
              payload: updateCart,
            });
          } else {
            cart.products[productIndexInCart].quantity += 1;
            const funciona = await cartsService.cartUpdate(cid, cart);
            res.status(202).json({
              status: "Success",
              message: "Existing product, quantity was increased",
              payload: funciona,
            });
          }
        } else {
          res.status(404).json({
            status: "Error",
            message: `Product ID ${pid} not found`,
            payload: {},
          });
        }
      }
    } catch (error) {
      res.status(500).json({
        status: "Error",
        message: error.message,
        payload: {},
      });
    }
  }
  async cartDeleteProduct(req, res) {
    const { cid, pid } = req.params;
    try {
      const cart = await cartsService.cartById(cid);
      if (!cart) {
        res.status(404).json({
          status: "Error",
          message: `Cart ID ${cid} not found`,
          payload: {},
        });
      } else {
        const productIndexInCart = cart.products.findIndex(
          (elem) => elem.product._id.toString() === pid
        );
        if (productIndexInCart === -1) {
          res.status(404).json({
            status: "Error",
            message: `Product ID ${pid} not found in cart ${cid}`,
            payload: {},
          });
        } else {
          cart.products.splice(productIndexInCart, 1);
          const updateCart = await cartsService.cartUpdate(cid, cart);
          res.status(200).json({
            status: "Success",
            message: `Product ID ${pid} deleted from cart ${cid} successfully`,
            payload: updateCart,
          });
        }
      }
    } catch (error) {
      res.status(500).json({
        status: "Error",
        message: error.message,
        payload: {},
      });
    }
  }
  async cartUpdateArray(req, res) {
    const { cid } = req.params;
    const newInfo = req.body;
    try {
      const cart = await cartsService.cartById(cid);
      if (!cart) {
        res.status(404).json({
          status: "Error",
          message: `Cart ID ${cid} not found`,
          payload: {},
        });
      } else {
        const updateCart = await cartsService.cartUpdateArray(cid, newInfo);
        res.status(200).json({
          status: "Success",
          message: `Cart ID ${cid} updated successfully`,
          payload: updateCart,
        });
      }
    } catch (error) {
      res.status(400).json({
        status: "Error",
        message: `An error has occurred: ` + error.message,
        payload: {},
      });
    }
  }
  async cartUpdateQuantity(req, res) {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    try {
      const cart = await cartsService.cartById(cid);
      if (!cart) {
        res.status(404).json({
          status: "Error",
          message: `Cart ID ${cid} not found`,
          payload: {},
        });
      } else {
        const productIndexInCart = cart.products.findIndex(
          (elem) =>
            elem.product &&
            elem.product._id &&
            elem.product._id.toString() === pid
        );
        if (productIndexInCart === -1) {
          res.status(404).json({
            status: "Error",
            message: `Product ID ${pid} not found in cart ${cid}`,
            payload: {},
          });
        } else {
          cart.products[productIndexInCart].quantity = quantity;
          const updateCart = await cartsService.cartUpdate(cid, cart);
          res.status(200).json({
            status: "Success",
            message: `Quantity of Product ID ${pid}, updated successfully`,
            payload: updateCart,
          });
        }
      }
    } catch (error) {
      res.status(400).json({
        status: "Error",
        message: `An error has occurred: ` + error.message,
        payload: {},
      });
    }
  }
  async cartEmpty(req, res) {
    const { cid } = req.params;
    try {
      const cart = await cartsService.cartById(cid);
      if (!cart) {
        res.status(404).json({
          status: "Error",
          message: `Cart ID ${cid} not found`,
          payload: {},
        });
      } else {
        const deleteCart = await cartsService.cartEmpty(cid);
        res.status(200).json({
          status: "Success",
          message: `Cart ID ${cid} deleted successfully`,
          payload: deleteCart,
        });
      }
    } catch (error) {
      res.status(500).json({
        status: "Error",
        message: error.message,
        payload: {},
      });
    }
  }
  async cartPurchase(req, res) {
    // La compra debe corroborar el stock del producto al momento de finalizarse
    // Si el producto tiene suficiente stock para la cantidad indicada en el producto del carrito, entonces restarlo del stock del producto y continuar.
    // Si el producto no tiene suficiente stock para la cantidad indicada en el producto del carrito, entonces no agregar el producto al proceso de compra.
    // Al final, utilizar el servicio de Tickets para poder generar un ticket con los datos de la compra.
    // En caso de existir una compra no completada, devolver el arreglo con los ids de los productos que no pudieron procesarse.
    const { cid } = req.params;
  }
}

export default new CartsController();
