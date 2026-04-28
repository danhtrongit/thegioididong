import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { CategoriesModule } from './categories/categories.module.js';
import { BrandsModule } from './brands/brands.module.js';
import { ProductsModule } from './products/products.module.js';
import { SpecificationsModule } from './specifications/specifications.module.js';
import { InventoryModule } from './inventory/inventory.module.js';
import { PromotionsModule } from './promotions/promotions.module.js';
import { MediaModule } from './media/media.module.js';
import { PagesModule } from './pages/pages.module.js';
import { ArticlesModule } from './articles/articles.module.js';
import { CartModule } from './cart/cart.module.js';
import { OrdersModule } from './orders/orders.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    CategoriesModule,
    BrandsModule,
    ProductsModule,
    SpecificationsModule,
    InventoryModule,
    PromotionsModule,
    MediaModule,
    PagesModule,
    ArticlesModule,
    CartModule,
    OrdersModule,
  ],
})
export class AppModule {}
