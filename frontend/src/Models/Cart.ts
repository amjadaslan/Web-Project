import { Product } from "./Product";

export class CartItem {
    constructor(
        readonly product: Product,
        readonly quantity: number
    ) { }
}