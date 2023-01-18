import { Order, Address,Coupon } from "./orderSchema.js";
import { v4 as uuidv4 } from "uuid";


class OrderService {

    async getOrder(orderId: string){
        const order = await Order.findOne({ id: orderId }).select('-__v -_id');
        return order;
    }

    async createOrder({ customerName, streetAddress, apartment, city, state, country, zipCode }) {
        const address = new Address({ streetAddress: streetAddress, apartment:apartment, city:city, state:state, country:country, zipCode:zipCode });
        const order = new Order({ id: uuidv4(), customerName: customerName, address: address });
        return order;
    }

    async markAsDelivered(orderId: string) {
        const order = await Order.findOne({ id: orderId }).select('-__v -_id');
        order.status = 'Delivered';
        return order;
    }

    async createCoupon({value, total}){
        const coupon = new Coupon({value: value,total:total});
        await coupon.save();
        return coupon;
    }

    async validateCoupon({value}){
        const coupon = await Coupon.findOne({ value: value }).select('-__v -_id');
        return coupon?coupon.total:-1;
    }

}

export default OrderService;