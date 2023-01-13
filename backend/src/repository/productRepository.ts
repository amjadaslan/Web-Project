import Product from "../models/productSchema.js";
import { v4 as uuidv4 } from "uuid";

class ProductRepository{

    async createProduct({ name, category, description, price, stock, image } ){
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
        return res;
    }

    async getProductById(id: string){
        const product = await Product.findOne({ id: id }).select('-__v -_id');
        return product;
    }

    async getProductsByCategory(type: string){
        const products = await Product.find({ category: type }).select('-__v -_id');
        return products;
    }
}

export default ProductRepository;