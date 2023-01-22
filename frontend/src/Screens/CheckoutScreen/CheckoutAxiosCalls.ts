import axios from "axios";
import { PaymentDetails } from "../../Models/PaymentDetails";
import { ShippingDetails } from "../../Models/ShippingDetails";
import { apiGatewayUrl } from "../components/constants";

axios.defaults.withCredentials = true;

export const MakeOrder = async (shippingDetails: ShippingDetails, paymentDetails: PaymentDetails) => {
    const name = shippingDetails.firstName + " " + shippingDetails.lastName;
    const address = shippingDetails.address;
    const city = shippingDetails.city;
    const state = shippingDetails.state;
    const zip = shippingDetails.zip;
    const country = shippingDetails.country;

    const cardHolder = paymentDetails.cardHolder;
    const cardNumber = paymentDetails.cardNumber;
    const expiryDate = paymentDetails.expiryDate;
    const cvv = paymentDetails.cvv;
    const coupon = paymentDetails.coupon;

    const details = {
        name: name, address: address, city: city, state: state, zip: zip, country: country,
        cardHolder: cardHolder, cardNumber: cardNumber, expiryDate: expiryDate, cvv: cvv, coupon: coupon
    }
    return await axios.post(`${apiGatewayUrl}/api/order`, details);

}