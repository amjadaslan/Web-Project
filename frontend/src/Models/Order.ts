export class Order {
    constructor(
        readonly id: string = "",
        readonly customerName: string = "",
        readonly address: string = "",
        readonly status: string = ""
    ) { }
}