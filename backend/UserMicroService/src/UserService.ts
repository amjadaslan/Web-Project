import { User } from "./userSchema.js";
import { v4 as uuidv4 } from "uuid";
import * as bcrypt from "bcrypt";

class UserService {

    //Retrieves a user based on its id
    async getUser(userId: string) {
        const user = await User.findOne({ userId: userId });
        return user;
    }

    async createAdmin() {
        const cryptedPass = await bcrypt.hash("admin", 10);
        const newAdmin = new User({ userId: uuidv4(), username: "admin", password: cryptedPass, permission: "A" });
        newAdmin.save();
    }

    //Retrieves a user based on its username
    async getUserByUsername(userName: string) {
        const user = await User.findOne({ username: userName });
        return user;
    }

    //Creates a user and adds it to the DB
    async createUser({ username, password, permission, question, answer }) {

        const user = new User({ userId: uuidv4(), username, password, permission, question, answer });
        await user.save();
    }

    //Changes User's password [forgot password]
    async changeUserPassword(userName: string, password: string) {
        const userToUpdate = await User.findOne({ username: userName });
        userToUpdate.password = password;
        await userToUpdate.save();
    }

    //Changes permission to the selected user
    async changeUserPermission(userName: string, permission: string) {
        const userToUpdate = await User.findOne({ username: userName });
        userToUpdate.permission = permission;
        await userToUpdate.save();
    }
}

export default UserService;