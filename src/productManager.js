import fs from "fs";

class ProductManager {
  static id = 0;
  constructor(path) {
    this.path = path;
  }
  async loadData() {
    try {
      return JSON.parse(fs.readFileSync(this.path, "utf-8"));
    } catch (error) {
      return [];
    }
  }
  async saveData(data) {
    try {
      fs.writeFileSync(this.path, JSON.stringify(data));
    } catch (error) {
      return `Could not save file: ${error}`;
    }
  }
  async addProduct(productoToAdd) {
    try {
      const db = await this.loadData();
      const codeCheck = db.some(
        (product) => product.code === productoToAdd.code
      );
      if (codeCheck) {
        return `The Code ${productoToAdd.code} already exists in Database`;
      }
      if (
        !productoToAdd.title ||
        !productoToAdd.description ||
        !productoToAdd.price ||
        !productoToAdd.code ||
        !productoToAdd.stock ||
        !productoToAdd.status
      ) {
        return `All fields are required`;
      } else {
        if (db.length === 0) {
          this.id = 1;
        } else {
          this.id = db[db.length - 1].id + 1;
        }
        const productOk = { id: this.id, ...productoToAdd };
        db.push(productOk);
        this.saveData(db);
        return productOk;
      }
    } catch (error) {}
  }

  async getProducts() {
    const db = await this.loadData();
    return db;
  }

  async getProductById(id) {
    const db = await this.loadData();
    const productExist = db.find((elem) => elem.id === parseInt(id));
    if (!productExist) {
      throw new Error(`Product ID ${id} not found`);
    }
    return productExist;
  }

  async updateProduct(id, update) {
    const db = await this.loadData();
    const prodIndex = db.findIndex((elem) => elem.id === parseInt(id));
    if (prodIndex !== -1) {
      db[prodIndex] = { ...db[prodIndex], ...update };
      this.saveData(db);
      return db[prodIndex];
    } else {
      return `Product ID ${id} not found`;
    }
  }

  async deleteProduct(id) {
    const db = await this.loadData();
    const prodIndex = db.findIndex((elem) => elem.id === parseInt(id));
    if (prodIndex !== -1) {
      const deletedProduct = db.splice(prodIndex, 1);
      this.saveData(db);
      return deletedProduct;
    } else {
      return `Product ID ${id} not found`;
    }
  }
}

export default ProductManager;
