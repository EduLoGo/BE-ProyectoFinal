import fs from "fs";

class ProductManager {
  id = 0;
  constructor(path) {
    this.path = path;
  }
  // Cargar Archivo
  async loadData() {
    try {
      if (fs.existsSync(this.path)) {
        const dataDB = await fs.promises.readFile(this.path, "utf-8");
        return JSON.parse(dataDB);
      }
      await fs.promises.writeFile(this.path, JSON.stringify([]));
      return [];
    } catch (error) {
      throw new Error("Couldn't lead Products DB");
    }
  }
  // Guardar en Archivo
  async saveData(data) {
    try {
      await fs.promises.writeFile(this.path, JSON.stringify(data));
    } catch (error) {
      return console.log(`Couldn't save data`);
    }
  }
  // Agregar Producto
  async addProduct(newProduct) {
    try {
      const dataDB = await this.loadData();
      let checkCode = dataDB.some((elem) => elem.code === newProduct.code);
      if (checkCode) {
        throw new Error(`Code already exist`);
      } else if (
        !newProduct.title ||
        !newProduct.description ||
        !newProduct.price ||
        !newProduct.code ||
        !newProduct.stock
      ) {
        throw new Error(`Missing data`);
      } else {
        if (dataDB.length === 0) {
          this.id = 1;
        } else {
          this.id = dataDB[dataDB.length - 1].id + 1;
        }
        let productUpdated = newProduct.thumbnail
          ? {
              id: this.id,
              ...newProduct,
              thumbnail: [newProduct.thumbnail],
              status: true,
            }
          : {
              id: this.id,
              ...newProduct,
              thumbnail: [],
              status: true,
            };
        this.id++;
        dataDB.push(productUpdated);
        await this.saveData(dataDB);
        return productUpdated;
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }
  // Obtener todos los Productos
  getProducts() {
    const dataDB = this.loadData();
    return dataDB;
  }
  // Obtener Producto por ID
  getProductByID(id) {
    const dataDB = this.loadData();
    let existProduct = dataDB.find((elem) => elem.id === id);
    if (existProduct) {
      return existProduct;
    } else {
      return `Product ID ${id} not found!`;
    }
  }
  // Actualizar Producto
  updateProduct(id, newInfo) {
    const dataDB = this.loadData();
    let index = dataDB.findIndex((elem) => elem.id === id);
    if (index !== -1) {
      dataDB[index] = { ...dataDB[index], ...newInfo };
      this.saveData(dataDB);
      return dataDB[index];
    } else {
      return `Product ID ${id} not found!`;
    }
  }
  // Eliminar Producto
  deleteProduct(id) {
    try {
      const dataDB = this.loadData();
      let index = dataDB.findIndex((elem) => elem.id === id);
      if (index !== -1) {
        const delProduct = dataDB[index];
        dataDB.splice(index, 1);
        this.saveData(dataDB);
        return delProduct;
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export default ProductManager;
