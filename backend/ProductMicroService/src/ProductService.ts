import Product from "../models/productSchema.js";
import { v4 as uuidv4 } from "uuid";

class ProductService {

    async createProduct({ name, category, description, price, stock, image }) {
        const product = new Product({
            id: uuidv4(),
            name: name,
            category: category,
            description: description,
            price: price,
            stock: stock,
            image: image
        });
        const res = await product.save();
        return res.id;
    }

    async getProductById(id: string) {
        const product = await Product.findOne({ id: id }).select('-__v -_id');
        return product;
    }

    async getProductsByCategory(type: string) {
        const products = await Product.find({ category: type }).select('-__v -_id');
        return products;
    }

    async updateProduct({ id, name, category, description, price, stock, image }) {
        const prod = await Product.findOne({ id: id });
        const productData = {
            name: name || prod.name,
            category: category || prod.category,
            description: description || prod.description,
            price: price || prod.price,
            stock: stock || prod.stock,
            image: image || prod.image
        }
        await prod.updateOne(productData);
    }

    async removeProduct(id: string) {
        const prod = await Product.findOne({ id: id });

        if (prod) {
            await prod.delete();
        }
    }
}

export default ProductService;