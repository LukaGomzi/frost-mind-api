import { Module } from "@nestjs/common";
import { FoodItemService } from "./food-item.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FoodItem } from "./entities/food-item.entity";
import { FoodTypeModule } from "../food-type/food-type.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([FoodItem]),
        FoodTypeModule,
    ],
    providers: [FoodItemService]
})
export class FoodItemModule {}