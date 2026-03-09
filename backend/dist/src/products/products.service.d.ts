import { PrismaService } from '../prisma/prisma.service';
import { ProductCategory } from '@prisma/client';
export declare class ProductsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(category?: string): $Public.PrismaPromise<T>;
    findOne(id: string): Promise<any>;
    create(data: {
        category: ProductCategory;
        brand: string;
        model: string;
        description: string;
        photoUrl?: string;
        price: number;
        isAvailable?: boolean;
    }): import(".prisma/client").Prisma.Prisma__ProductClient<$Result.GetResult<import(".prisma/client").Prisma.$ProductPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, $Extensions.DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, data: {
        category?: ProductCategory;
        brand?: string;
        model?: string;
        description?: string;
        photoUrl?: string;
        price?: number;
        isAvailable?: boolean;
    }): Promise<$Result.GetResult<import(".prisma/client").Prisma.$ProductPayload<ExtArgs>, T, "update", GlobalOmitOptions>>;
    remove(id: string): Promise<$Result.GetResult<import(".prisma/client").Prisma.$ProductPayload<ExtArgs>, T, "delete", GlobalOmitOptions>>;
}
