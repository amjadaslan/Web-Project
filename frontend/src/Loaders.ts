import axios from "axios";
import { exampleCartItem, exampleOrder, exampleProduct } from "./debug";
import { CartItem } from "./Models/Cart";
import { Order } from "./Models/Order";
import { Product } from "./Models/Product";
import { UserInfo } from "./Models/UserInfo";
import { apiGatewayUrl } from "./Screens/components/constants";

axios.defaults.withCredentials = true;

export const fetchProducts = async (setAllProducts: React.Dispatch<React.SetStateAction<Product[]>>) => {
    //setAllProducts([exampleProduct(), exampleProduct(), exampleProduct()])
    await axios({
        method: 'GET',
        url: `${apiGatewayUrl}/api/product/all`
    }).then(response => {
        console.log(response.data);
        setAllProducts(response.data.map((obj: any) => obj as Product));
    }).catch((error) => {
        console.log(error);
    });
}

export const fetchOrders = async (setAllOrders: React.Dispatch<React.SetStateAction<Order[]>>) => {
    //setAllOrders([exampleOrder(), exampleOrder(), exampleOrder()])
    await axios({
        method: 'GET',
        url: `${apiGatewayUrl}/api/order/all`
    }).then(response => {
        console.log(response.data);
        setAllOrders(response.data.map((obj: any) => obj as Order));
    }).catch((error) => {
        console.log(error);
    });
}

export const fetchCart = async (setAllCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>) => {
    setAllCartItems([exampleCartItem(), exampleCartItem(), exampleCartItem(), exampleCartItem(), exampleCartItem(), exampleCartItem(), exampleCartItem(), exampleCartItem(), exampleCartItem(), exampleCartItem(), exampleCartItem(), exampleCartItem()])
}

export const fetchUserInfo = async (setUserInfo: React.Dispatch<React.SetStateAction<UserInfo>>) => {
    let userInfo: UserInfo;
    await axios({
        method: 'GET',
        url: `${apiGatewayUrl}/api/user/userInfo`
    }).then((response) => {
        setUserInfo(response.data as UserInfo)
        console.log(response.data as UserInfo);
    }).catch((error) => {
        console.log(error);
    });
}