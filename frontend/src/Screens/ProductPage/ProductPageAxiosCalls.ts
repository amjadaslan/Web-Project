import axios from "axios";
import { apiGatewayUrl } from "../components/constants";

axios.defaults.withCredentials = true;

export const AddToCart = async (productId: string, quantity: number) => {
    return await axios.post(`${apiGatewayUrl}/api/cart/`, { prodId: productId, prodCount: quantity });
}