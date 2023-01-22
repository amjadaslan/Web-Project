import * as amqp from "amqplib";

export class ProducerChannel {
  channel: amqp.Channel;

  async createChannel() {
    const connection = await amqp.connect("amqps://smbargni:48QYI_S6HQEbaLS7Q5i-ly4vbcwDNmXU@sparrow.rmq.cloudamqp.com/smbargni");
    this.channel = await connection.createChannel();
  }

  async sendEvent(msg: string) {
    if (!this.channel) {
      await this.createChannel();
    }

    const exchange = "order_exchange";

    // create the exchange if it doesn't exist
    await this.channel.assertExchange(exchange, "fanout", { durable: false });

    // publish the message to the exchange
    await this.channel.publish(exchange, "", Buffer.from(msg));
    console.log(
      `Publisher >>> | message "${msg}" published to exchange "${exchange}"`
    );
  }
}