import axios from "axios";
import { apiGatewayUrl } from "../components/constants";

axios.defaults.withCredentials = true;

//Should the call be await?
export const UpdateCartItemQuantity = async (productId: string, newQuantity: number) => {
    console.log(productId)
    console.log(newQuantity)
    return await axios.put(`${apiGatewayUrl}/api/cart/`, { prodId: productId, prodCount: newQuantity });
}

export const RemoveItemFromCart = async (productId: string) => {
    return await axios.put(`${apiGatewayUrl}/api/cart/`, { prodId: productId });
}