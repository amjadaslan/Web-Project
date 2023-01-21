export class Product {
    constructor(
        readonly id: string = "",
        readonly name: string = "",
        readonly category: string = "",
        readonly description: string = "",
        readonly price: number = 0,
        readonly stock: number = 0,
        readonly image: string = ""
    ) { }
}

export const validProductCategories =
    [
        "t-shirt",
        "hoodie",
        "hat",
        "necklace",
        "bracelet",
        "shoes",
        "pillow",
        "mug",
        "book",
        "puzzle",
        "cards"
    ];
