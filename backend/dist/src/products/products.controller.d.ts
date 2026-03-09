import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findAll(category?: string): $Public.PrismaPromise<T>;
    findOne(id: string): Promise<any>;
    create(createProductDto: CreateProductDto): import(".prisma/client").Prisma.Prisma__ProductClient<$Result.GetResult<import(".prisma/client").Prisma.$ProductPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, $Extensions.DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<$Result.GetResult<import(".prisma/client").Prisma.$ProductPayload<ExtArgs>, T, "update", GlobalOmitOptions>>;
    remove(id: string): Promise<$Result.GetResult<import(".prisma/client").Prisma.$ProductPayload<ExtArgs>, T, "delete", GlobalOmitOptions>>;
}
