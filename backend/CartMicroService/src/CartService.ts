import { Cart, CartItem } from "./cartSchema.js";


class CartService {

    async getCart(userID: string) {
        const cart = await Cart.findOne({ userId: userID }).select('-__v -_id');
        return cart;
    }

    async addToCart(userID: string, prodCount: number, prodId: string) {
        const cartItem = new CartItem({ count: prodCount, productId: prodId });
        let cart = await Cart.findOne({ userId: userID }).select('-__v -_id');
        if (!cart) {
            cart = new Cart({ userId: userID, items: [] });
            cart.items.push(cartItem);
            await cart.save();
            return;
        }
        
        console.log("Adding item");
        const itemAlreadyExists = cart.items.find(i => i.productId == prodId);
        if (itemAlreadyExists) {
            console.log("Already Exists");
            const totCount = itemAlreadyExists.count + prodCount;
            console.log(totCount);

            await Cart.updateOne({ userId: cart.userId, "items.productId": prodId },
                { $set: { "items.$.count": totCount } });
        }
        else {
            let newItems = cart.items;
            newItems.push(cartItem);

            await Cart.updateOne({ userId: cart.userId, }, { $set: { items: newItems } });
        }
    }

    async updateCartItem(userID: string, prodCount: number, prodId: string) {
        const cart = await Cart.findOne({ userId: userID }).select('-__v -_id');
        const item = cart.items.find(i => i.productId == prodId);
        item.count = prodCount;
        if (prodCount === 0) {
            const id = cart.items.indexOf(item);
            cart.items.splice(id, 1);
            await Cart.updateOne({ userId: cart.userId, }, { $set: { items: cart.items } });
            return;
        }
        await Cart.updateOne({ userId: cart.userId, "items.productId": prodId },
            { $set: { "items.$.count": prodCount } });
    }

    async removeCartItem(userID: string, prodId: string){
        const cart = await Cart.findOne({ userId: userID }).select('-__v -_id');
        const id = cart.items.findIndex(i => i.productId == prodId);
        if(id!=-1){
            cart.items.splice(id, 1);
            await Cart.updateOne({ userId: cart.userId, }, { $set: { items: cart.items } });
            return;
        }
    }

    async removeCart(userID: string) {
        const cart = await Cart.findOne({ userId: userID }).select('-__v -_id');
        if (cart) {
            console.log("Removing Cart");
            await Cart.findOneAndRemove({userId: userID});
        }
    }
}

export default CartService;