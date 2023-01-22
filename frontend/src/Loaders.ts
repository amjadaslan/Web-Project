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
    let tempProducts : Product[] | null = null;
    await axios({
        method: 'GET',
        url: `${apiGatewayUrl}/api/product/all`
    }).then(response => {
        tempProducts = response.data.map((obj: any) => obj as Product);
        setAllProducts(response.data.map((obj: any) => obj as Product));
    }).catch((error) => {
        console.log(error);
    });

    return tempProducts;
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

export const fetchCart = async (products: Product[], setAllCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>) => {
    console.log(products);
    await axios.get(`${apiGatewayUrl}/api/cart/`).then((response) => {
        console.log(response.data);
        if (!response.data) {
            setAllCartItems([]);
            return;
        }
        console.log(response.data.items);
        setAllCartItems(response.data.items.map((obj: any) => {
            console.log(obj)
            const prod = products.find((product) => product.id == obj.productId) || exampleProduct();
            return new CartItem(prod, obj.count);
        }));
    })
        .catch((error) => {
            if (error.status == 404) {
                setAllCartItems([]);
            } else {
                console.log(error);
            }
        });
}

export const fetchUserInfo = async (setUserInfo: React.Dispatch<React.SetStateAction<UserInfo>>) => {
    return await axios({
        method: 'GET',
        url: `${apiGatewayUrl}/api/user/userInfo`
    }).then((response) => {
        setUserInfo(response.data as UserInfo)
    });
}