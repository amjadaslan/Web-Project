import { Order, Address } from "../models/orderSchema.js";
import { v4 as uuidv4 } from "uuid";


class OrderService {

    async createOrder({ customerName, streetAddress, apartment, city, state, country, zipCode }) {
        const address = new Address({ streetAddress: streetAddress, apartment:apartment, city:city, state:state, country:country, zipCode:zipCode });
        const order = new Order({ id: uuidv4(), customerName: customerName, address: address });
        return order;
    }

    async changeOrderStatus(orderId: string) {
        const order = await Order.findOne({ id: orderId }).select('-__v -_id');
        order.status = 'Delivered';
        return order;
    }
}

export default OrderService;