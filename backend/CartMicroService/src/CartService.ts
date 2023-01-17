import { Cart, CartItem } from "./cartSchema.js";


class CartService {

    async getCart(userID: string) {
        const cart = await Cart.findOne({ userId: userID }).select('-__v -_id');
        return cart;
    }

    async addToCart(userID: string, prodCount: number, prodId: string, prodPrice: number) {
        const cartItem = new CartItem({ count: prodCount, productId: prodId, price: prodPrice });
        let cart = await Cart.findOne({ userId: userID }).select('-__v -_id');
        if (!cart) {
            cart = new Cart({ userId: userID, items: [] });
        }
        const itemAlreadyExists = cart.items.find(i => i.productId === prodId);
        if (itemAlreadyExists) {
            itemAlreadyExists.count += prodCount;
        }
        else {
            cart.items.push(cartItem);
        }
        cart.total += prodCount * prodPrice;
        await cart.save();
    }

    async updateCartItem(userID: string, prodCount: number, prodId: string) {
        const cart = await Cart.findOne({ userId: userID }).select('-__v -_id');
        const item = cart.items.find(i => i.productId === prodId);
        item.count = prodCount;
        if (prodCount === 0) {
            const id = cart.items.indexOf(item);
            cart.items.splice(id, 1);
        }
        await cart.save();
    }

    async removeCart(userID: string) {
        const cart = await Cart.findOne({ userId: userID }).select('-__v -_id');

        if (cart) {
            await cart.delete();
        }
    }
}

export default CartService;