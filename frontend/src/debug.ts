import { Order } from "./Models/Order"
import { Product } from "./Models/Product"

export const exampleProduct = () => {
    return new Product(Math.floor(Math.random()*100000).toString(), 'Example Product Name', 'puzzle', 'This is a description', 12, 35, "")
}

export const exampleOrder = () => {
    return new Order(Math.floor(Math.random()*100000).toString(), "Some Customer", "Some Address", "Pending");
}