import axios from "axios";
import { Product } from "../../../Models/Product";
import { apiGatewayUrl } from "../../components/constants";

axios.defaults.withCredentials = true;

export const AddProduct = async (product: Product) => {
    console.log("adding a product..")
    return await axios.post(`${apiGatewayUrl}/api/product`, product );
}

export const DeleteProduct = async (productId: string) => {
    console.log("Removing a product");
    return await axios.delete(`${apiGatewayUrl}/api/product/${productId}`);
}

export const EditProduct = async (modifiedProduct: Product) => {
    console.log(modifiedProduct);
    console.log("Editing a product");
    return await axios.put(`${apiGatewayUrl}/api/product/${modifiedProduct.id}`,modifiedProduct);
}