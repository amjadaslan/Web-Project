import { User } from "./userSchema.js";
import { v4 as uuidv4 } from "uuid";

class UserService {

    //Retrieves a user based on its id
    async getUser(userId: string) {
        const user = await User.findOne({ userId: userId });
        return user;
    }

    //Retrieves a user based on its username
    async getUserByUsername(userName: string) {
        const user = await User.findOne({ username: userName });
        return user;
    }

    //Creates a user and adds it to the DB
    async createUser({ username, password, permission }) {

        const user = new User({ userId: uuidv4(), username, password, permission, cart: [] });
        await user.save();
    }

    //Changes permission to the selected user
    async changeUserPermission(userName: string, permission: string) {
        const userToUpdate = await User.findOne({ username: userName });
        userToUpdate.permission = permission;
        await userToUpdate.save();
    }
}

export default UserService;