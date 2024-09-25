class ProductDTO {
  constructor(product) {
    this.id = product._id;
    this.title = product.title;
    this.description = product.description;
    this.price = product.price;
    this.category = product.category;
    this.thumbnail = product.thumbnail;
    this.stock = product.stock;
  }
}

export default ProductDTO;
