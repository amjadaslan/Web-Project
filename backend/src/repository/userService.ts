import {User,CartItem} from "../models/userSchema.js";
import { v4 as uuidv4 } from "uuid";

class UserService {

    async getUser(userName: string) {
        const user = await User.findOne({ username: userName });
        return user;
    }

    async createUser({ userId, username, password, permission }) {
        
        const user = new User({ userId, username,password, permission,cart:[] });
        await user.save();
    }

    async changeUserPermission(userName: string, permission: string) {
        const userToUpdate = await User.findOne({ username: userName });
        userToUpdate.permission = permission;
        await userToUpdate.save();
    }

    async addToCart(userName:string, count: Number , prodId: string){
        const cartItem = new CartItem({count: count, productId: prodId});
        const user = await User.findOne({username: userName});
        user.cart.push(cartItem);
        
    }

}

export default UserService;