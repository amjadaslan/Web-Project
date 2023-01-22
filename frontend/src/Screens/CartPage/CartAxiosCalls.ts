import axios from "axios";

axios.defaults.withCredentials = true;

//Should the call be await?
export const UpdateCartItemQuantity = async (productId: string, newQuantity: number) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`Changed quantity to ${newQuantity}`);
}

export const RemoveItemFromCart = async (productId: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`Removed item`);
}