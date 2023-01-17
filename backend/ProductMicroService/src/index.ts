
import { Request, Response } from "express";
import ProductService from "./ProductService.js";

const validCategories = ["t-shirt", "hoodie", "hat", "necklace", "bracelet", "shoes", "pillow", "mug", "book", "puzzle", "cards"];

const productService = new ProductService();

export default (app) => {
    app.get('/api/product/:idorType', function (req: Request, res: Response) { getProduct(req, res, req.params.idorType); });

    app.post('/api/product', function (req: Request, res: Response) { createProduct(req, res); });

    app.put('/api/product/:id', function (req: Request, res: Response) { updateProduct(req, res, req.params.id); });

    app.delete('/api/product/:id', function (req: Request, res: Response) { removeProduct(req, res, req.params.id); });


}

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


const createProduct = async (req: Request, res: Response) => {
    if (["A", "M"].includes(req.params.permission)) {
        // Read request body.
        let body = "";
        req.on("data", (chunk) => {
            body += chunk.toString();
        });
        req.on("end", async () => {
            // Parse request body as JSON
            try {
                let { name, category, description, price, stock, image } = JSON.parse(body);
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

            // Mongoose will automatically insert this document to our collection!

        });
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


//TODO: #8 replace parsing body manually with express body-parser
const updateProduct = async (req: Request, res: Response, id: string) => {
    if (["A", "M"].includes(req.params.permission)) {
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
            let body = "";
            req.on("data", (chunk) => {
                body += chunk.toString();
            });
            req.on("end", async () => {
                // Parse request body as JSON
                try {
                    JSON.parse(body);
                } catch (err) {
                    res.statusCode = 400;
                    res.end();
                    return;
                }
                const { name, category, description, price, stock, image } = JSON.parse(body);
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

            });
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

    if (req.params.permission == "A") {
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
