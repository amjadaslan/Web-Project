import axios from "axios";
import { Product } from "../../../Models/Product";

axios.defaults.withCredentials = true;

export const AddProduct = async (product: Product) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("add")
}

export const DeleteProduct = async(productId: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("delete")
}

export const EditProduct = async(modifiedProduct: Product) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("edit")
}