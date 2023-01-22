import * as amqp from "amqplib";
import ProductService from "./ProductService.js";

const port = 3001;

const productService = new ProductService();

const consumeMessages = async () => {
    try {
        // connect to RabbitMQ
        const conn = await amqp.connect(
            "amqps://poydjifg:koR7IuNQyO4fmuvNGK0byP6oaN3fo8zs@sparrow.rmq.cloudamqp.com/poydjifg"
        );
        const channel = await conn.createChannel();

        // create the exchange if it doesn't exist
        const exchange = "order_exchange";
        await channel.assertExchange(exchange, "fanout", { durable: false });

        // create the queue if it doesn't exist
        const queue = "order_queue";
        await channel.assertQueue(queue, { durable: false });

        // bind the queue to the exchange
        await channel.bindQueue(queue, exchange, "");

        // consume messages from the queue
        await channel.consume(queue, async (items: any[]) => {
            for (let item of items) {
                const product = await productService.getProductById(item.prodId);
                const newStock = product.stock - item.count;
                await productService.updateProduct({ id: product.id, name: product.name, category: product.category, description: product.description, price: product.price, stock: newStock, image: product.image })
            }
        });
    } catch (error) {
        console.error(error);
    }
};

// start consuming messages
consumeMessages();