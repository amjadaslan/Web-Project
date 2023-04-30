import axios from "axios";
import { apiGatewayUrl } from "../constants";

axios.defaults.withCredentials = true;

export const SendLogoutRequest = async () => {
    return await axios.post(`${apiGatewayUrl}/api/user/logout`);
}