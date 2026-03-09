export declare enum ProductCategory {
    SPEAKER = "speaker",
    INSTRUMENT = "instrument"
}
export declare class CreateProductDto {
    category: ProductCategory;
    brand: string;
    model: string;
    description: string;
    photoUrl?: string;
    price: number;
}
