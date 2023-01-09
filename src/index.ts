import { createServer, IncomingMessage, ServerResponse } from "http";
import * as mongoose from "mongoose";
import * as bcrypt from "bcrypt";

// import with .js, and not ts.
// for more info: https://devblogs.microsoft.com/typescript/announcing-typescript-4-7/#type-in-package-json-and-new-extensions

import { DBUSERNAME, DBPASS, LOGIN, SIGNUP } from "./const.js";
import { loginRoute, signupRoute, changePermission } from "./auth.js";
import { getProduct, createProduct, updateProduct, removeProduct } from "./product/productRoutes.js";
import Users from "./models/userSchema.js";
import { v4 as uuidv4 } from "uuid";

const port = process.env.PORT || 3000;

const dbUri = `mongodb+srv://${DBUSERNAME}:${DBPASS}@cluster0.g83l9o2.mongodb.net/?retryWrites=true&w=majority`;
await mongoose.connect(dbUri);
const admin = await Users.findOne({ username: "admin" });
if (!admin) {
  const cryptedPass = await bcrypt.hash("admin", 10);
  const newAdmin = new Users({ id: uuidv4(), username: "admin", password: cryptedPass, permission: "A" });
  newAdmin.save();
}


const server = createServer((req: IncomingMessage, res: ServerResponse) => {
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
  else if (req.url === '/api/signup' && req.method === 'POST') {
    signupRoute(req, res);
  }
  else if (req.url === '/api/login' && req.method === 'POST') {
    loginRoute(req, res);
  }
  else if (req.url === '/api/permission' && req.method === 'PUT') {
    changePermission(req, res);
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        message: 'Route Not Found',
      })
    );
  }
});

server.listen(port);
console.log(`Server running! port ${port}`);