import axios from "axios";
import { PaymentDetails } from "../../Models/PaymentDetails";
import { ShippingDetails } from "../../Models/ShippingDetails";

axios.defaults.withCredentials = true;

export const MakeOrder = async (shippingDetails: ShippingDetails, paymentDetails: PaymentDetails) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("add");
}