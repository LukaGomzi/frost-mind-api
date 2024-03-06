import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { DatabaseModule } from "./config/database/database.module";
import { AuthModule } from "./auth/auth.module";
import { FreezerModule } from './freezer/freezer.module';
import { FoodTypeModule } from "./food-type/food-type.module";
import { FoodItemModule } from "./food-item/food-item.module";

@Module({
  imports: [
    UserModule,
    DatabaseModule,
    AuthModule,
    FreezerModule,
    FoodTypeModule,
    FoodItemModule
  ]
})
export class AppModule {}
