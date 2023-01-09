import { createServer } from "http";
import * as mongoose from "mongoose";
// import with .js, and not ts.
// for more info: https://devblogs.microsoft.com/typescript/announcing-typescript-4-7/#type-in-package-json-and-new-extensions
import { DBUSERNAME, DBPASS } from "./const.js";
import { getProduct, createProduct, updateProduct, removeProduct } from "../product/productRoutes.js";
const port = process.env.PORT || 3000;
const dbUri = `mongodb+srv://${DBUSERNAME}:${DBPASS}@cluster0.g83l9o2.mongodb.net/?retryWrites=true&w=majority`;
await mongoose.connect(dbUri);
const server = createServer((req, res) => {
    if (req.url.match(/\/api\/product\/\w+/) && req.method === 'GET') {
        const idorType = req.url.split('/')[3];
        getProduct(req, res, idorType);
    }
    else if (req.url === '/api/product' && req.method === 'POST') {
        createProduct(req, res);
    }
    else if (req.url.match(/\/api\/product\/\w+/) && req.method === 'PUT') {
        const id = req.url.split('/')[3];
        updateProduct(req, res, id);
    }
    else if (req.url.match(/\/api\/product\/\w+/) && req.method === 'DELETE') {
        const id = req.url.split('/')[3];
        removeProduct(req, res, id);
    }
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            message: 'Route Not Found: Please use the api/products endpoint',
        }));
    }
});
server.listen(port);
console.log(`Server running! port ${port}`);
//# sourceMappingURL=index.js.map