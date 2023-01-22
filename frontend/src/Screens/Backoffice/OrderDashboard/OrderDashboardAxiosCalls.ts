import axios from "axios";
import { apiGatewayUrl } from "../../components/constants";

axios.defaults.withCredentials = true;

export const MarkAsDelivered = async (orderId: string) => {
    return await axios.put(`${apiGatewayUrl}/api/order/${orderId}`);
}