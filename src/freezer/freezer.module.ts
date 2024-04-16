import { Module } from '@nestjs/common';
import { FreezerService } from './freezer.service';
import { FreezerController } from './freezer.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Freezer } from "./entities/freezer.entity";
import { UserFreezer } from "./entities/user-freezer.entity";
import { UserModule } from "../user/user.module";
import { FoodItem } from "./entities/food-item.entity";
import { FoodItemService } from "./food-item.service";
import { FoodTypeModule } from "../food-type/food-type.module";

@Module({
  imports: [
      TypeOrmModule.forFeature([Freezer, UserFreezer, FoodItem]),
      UserModule,
      FoodTypeModule,
  ],
  providers: [FreezerService, FoodItemService],
  controllers: [FreezerController],
  exports: [FreezerService]
})
export class FreezerModule {}
