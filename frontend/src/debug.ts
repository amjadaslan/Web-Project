import { CartItem } from "./Models/Cart"
import { Order } from "./Models/Order"
import { Product } from "./Models/Product"

export const exampleProduct = () => {
    return new Product(Math.floor(Math.random()*100000).toString(), 'Example Product Name', 'puzzle', 'This is a description', 12, 35, "https://cdn.vox-cdn.com/thumbor/Y_u1nR1TTRwj41OEZYvr3EeCSYg=/1400x1400/filters:format(jpeg)/cdn.vox-cdn.com/uploads/chorus_asset/file/13712762/Samus_Returns.jpg")
}

export const exampleOrder = () => {
    return new Order(Math.floor(Math.random()*100000).toString(), "Some Customer", "Some Address", "Pending");
}

export const exampleCartItem = () => {
    return new CartItem(exampleProduct(), 5);
}