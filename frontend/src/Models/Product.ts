export class Product {
    constructor(
        readonly id: string,
        readonly type: string,
        readonly name: string,
        readonly category: string,
        readonly description: string,
        readonly price: number,
        readonly stock: number,
        readonly imageUrl: string
    ) { }
}