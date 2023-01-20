
import jwt from "jsonwebtoken";
import bodyParser from "body-parser";
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { DBPASS, DBUSERNAME, ERROR_401 } from "./const.js";
import ProductService from "./ProductService.js";
import axios, { AxiosResponse } from "axios";
import cookieParser from 'cookie-parser';

interface RequestWithPermission extends Request {
    permission: string;
}

const validCategories = ["t-shirt", "hoodie", "hat", "necklace", "bracelet", "shoes", "pillow", "mug", "book", "puzzle", "cards"];

const userServiceURL = process.env.USER_SERVICE_URL || "http://localhost:3004";
const secretKey = process.env.SECRET_KEY || "your_secret_key";
const productService = new ProductService();

const dbUri = `mongodb+srv://${DBUSERNAME}:${DBPASS}@cluster0.g83l9o2.mongodb.net/?retryWrites=true&w=majority`;
await mongoose.connect(dbUri);

// Verify JWT token
const verifyJWT = (token: string) => {
    try {
        return jwt.verify(token, secretKey);
        // Read more here: https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback
        // Read about the diffrence between jwt.verify and jwt.decode.
    } catch (err) {
        return false;
    }
};

// Middelware for all protected routes. You need to expend it, implement premissions and handle with errors.
const protectedRout = (req: Request, res: Response) => {
    let cookies = req.headers.cookie.split('; ');
    console.log(cookies);

    // We get the token value from cookies.
    if (cookies.filter(str => str.startsWith("token")).length != 1) {
        res.statusCode = 401;
        res.end(
            JSON.stringify({
                message: "No token or improper form.",
            })
        );
        return ERROR_401;
    }
    const token = cookies.find(str => str.startsWith("token")).substring("token=".length);

    // Verify JWT token
    const user = verifyJWT(token);
    if (!user) {
        res.statusCode = 401;
        res.end(
            JSON.stringify({
                message: "Failed to verify JWT.",
            })
        );
        return ERROR_401;
    }

    // We are good!
    return user;
};



const app = express();

app.use(cookieParser());


app.use(bodyParser.json());

app.use(async (req: RequestWithPermission, res, next) => {

    const user = protectedRout(req, res);
    let response: AxiosResponse;
    try {
        response = await axios.get(`${userServiceURL}/api/user/${user.userId}/permission`, { withCredentials: true });
    } catch (err) {
        res.statusCode = 400;
        res.end();
        return;
    }
    if (user != ERROR_401) {
        req.permission = response.data;
        next();
    }
    else {
        res.statusCode = 401;
        res.end(
            JSON.stringify({
                message: "Unauthenticated user",
            })
        );
    }
});

const port = 3001;
app.get('/api/product/:idorType', function (req: RequestWithPermission, res: Response) { getProduct(req, res, req.params.idorType); });

app.post('/api/product', function (req: RequestWithPermission, res: Response) { createProduct(req, res); });

app.put('/api/product/:id', function (req: RequestWithPermission, res: Response) { updateProduct(req, res, req.params.id); });

app.delete('/api/product/:id', function (req: RequestWithPermission, res: Response) { removeProduct(req, res, req.params.id); });

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


const createProduct = async (req: RequestWithPermission, res: Response) => {
    if (["A", "M"].includes(req.permission)) {
        // Parse request body as JSON
        try {
            let { name, category, description, price, stock, image } = JSON.parse(req.body);
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
const updateProduct = async (req: RequestWithPermission, res: Response, id: string) => {
    if (["A", "M"].includes(req.permission)) {
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

            try {
                const { name, category, description, price, stock, image } = JSON.parse(req.body);
                if ((!name && !category && !description && !price && !stock && !image) ||
                    typeof price != 'number' || typeof stock != 'number' || !Number.isInteger(stock) || stock < 0 || price < 0 || price > 1000 || !validCategories.includes(category)) {

                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Invalid Details' }));
                    return;
                }
                await productService.updateProduct({ id, name, category, description, price, stock, image });
            } catch (err) {
                res.statusCode = 500;
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

const removeProduct = async (req: RequestWithPermission, res: Response, id: string) => {

    if (req.permission == "A") {
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
