import Product from "./productSchema.js";
import { v4 as uuidv4 } from "uuid";

class ProductService {

    //Creates a product and saves it within the DB
    async createProduct({ name, category, description, price, stock, image }) {
        console.log("create");
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

    //Returns a product from the DB based on it's id
    async getProductById(id: string) {
        const product = await Product.findOne({ id: id }).select('-__v -_id');
        return product;
    }

    //Returns a list of products based on a category
    async getProductsByCategory(type: string) {
        const products = await Product.find({ category: type }).select('-__v -_id');
        return products;
    }

    //Updates fields in a product (e.g., price, count)
    async updateProduct({ id, name, category, description, price, stock, image }) {
        if (stock == 0) {
            await this.removeProduct(id);
            return;
        }
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

    //Removes product from the DB
    async removeProduct(id: string) {
        const prod = await Product.findOne({ id: id });

        if (prod) {
            await prod.delete();
        }
    }

    //Gets all products from DB
    async getAllProducts() {
        const products = await Product.find({});
        return products;
    }
}

export default ProductService;