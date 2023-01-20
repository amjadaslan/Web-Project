
import bodyParser from "body-parser";
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { DBPASS, DBUSERNAME } from "./const.js";
import ProductService from "./ProductService.js";
import cors from 'cors';

const validCategories = ["t-shirt", "hoodie", "hat", "necklace", "bracelet", "shoes", "pillow", "mug", "book", "puzzle", "cards"];

const productService = new ProductService();

const frontEndUrl = process.env.PRODUCT_SERVICE_URL || "http://localhost:3000";
const apiGatewayUrl = process.env.API_GATEWAY_URL || "http://localhost:3005";

const dbUri = `mongodb+srv://${DBUSERNAME}:${DBPASS}@cluster0.g83l9o2.mongodb.net/?retryWrites=true&w=majority`;
await mongoose.connect(dbUri);

const app = express();

app.use(bodyParser.json());

app.use(cors({
    origin: apiGatewayUrl,
    credentials: true
}))

const port = 3001;

app.get('/api/product/all', function (req: Request, res: Response) { getAllProducts(req, res, req.params.idorType); });

app.get('/api/product/:idorType', function (req: Request, res: Response) { getProduct(req, res, req.params.idorType); });

app.post('/api/product', function (req: Request, res: Response) { createProduct(req, res); });

app.put('/api/product/:id', function (req: Request, res: Response) { updateProduct(req, res, req.params.id); });

app.delete('/api/product/:id', function (req: Request, res: Response) { removeProduct(req, res, req.params.id); });

app.listen(port, () => { console.log(`Listening to port ${port}`) });



const getProduct = async (req: Request, res: Response, idOrType: string) => {
    //We try to interpret input as Id. If that fails, we interpret as category
    const product = await productService.getProductById(idOrType);
    if (!product) {
        const products = await productService.getProductsByCategory(idOrType);
        if (products.length == 0) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Product Not Found' }));
            return;
        }
        else {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(products));
            return;
        }
    }
    else {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(product));
    }

};

const getAllProducts = async (req: Request, res: Response, idOrType: string) => {
    const products = await productService.getAllProducts();
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(products));
}


const createProduct = async (req: Request, res: Response) => {
    console.log(req.body);
    if (["A", "M"].includes("A")) {
        try {
            let { name, category, description, price, stock, image } = req.body;
            console.log(typeof stock);
            if (!name || !category || !description || !price || !stock || typeof price != 'number' || typeof stock != 'number' || !Number.isInteger(stock) || stock < 0 || price < 0 || price > 1000 || !validCategories.includes(category)) {

                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Invalid Details' }));
                return;
            }
            let prodId;
            try { prodId = await productService.createProduct({ name, category, description, price, stock, image }); } catch (err) {
                res.statusCode = 400;
                res.end();
                return;
            }
            res.statusCode = 201;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ id: prodId }));
            return;
        } catch (err) {
            res.statusCode = 400;
            res.end();
            return;
        }
    }
    //No Authorization to change permission
    else {
        res.statusCode = 403;
        res.end(
            JSON.stringify({
                message: "User has no proper permissions",
            })
        );
        return;
    }

};


//TODO: #8 replace parsing body manually with express body-parser
const updateProduct = async (req: Request, res: Response, id: string) => {
    if (["A", "M"].includes("A")) {
        let prod;
        try {
            prod = await productService.getProductById(id);
        } catch (err) {
            res.statusCode = 400;
            res.end();
            return;
        }
        if (!prod) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Product Not Found' }));
            return;
        }
        else {
            // Read request body.
            try {
                JSON.parse(req.body);
            } catch (err) {
                res.statusCode = 400;
                res.end();
                return;
            }
            const { name, category, description, price, stock, image } = req.body
            if ((!name && !category && !description && !price && !stock && !image) ||
                typeof price != 'number' || typeof stock != 'number' || !Number.isInteger(stock) || stock < 0 || price < 0 || price > 1000 || !validCategories.includes(category)) {

                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Invalid Details' }));
                return;
            }
            try {
                await productService.updateProduct({ id, name, category, description, price, stock, image });
            } catch (err) {
                res.statusCode = 400;
                res.end();
                return;
            }

            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ id: id }));
            return;
        }
    }
    else {//No Authorization to change permission
        res.statusCode = 403;
        res.end(
            JSON.stringify({
                message: "User has no proper permissions",
            })
        );
        return;
    }

};

const removeProduct = async (req: Request, res: Response, id: string) => {

    if ("A" == "A") {
        try {
            await productService.removeProduct(id);
        } catch (err) {
            res.statusCode = 400;
            res.end();
            return;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end();
        return;

    }
    //No Authorization to change permission
    else {
        res.statusCode = 403;
        res.end(
            JSON.stringify({
                message: "User has no proper permissions",
            })
        );
        return;
    }




};
