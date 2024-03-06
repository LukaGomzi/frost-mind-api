import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FoodType } from "./entities/food-type.entity";
import { FoodTypeController } from "./food-type.controller";
import { FoodTypeService } from "./food-type.service";
import { UserModule } from "../user/user.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([FoodType]),
        UserModule,
    ],
    controllers: [FoodTypeController],
    providers: [FoodTypeService],
    exports: [FoodTypeService]
})
export class FoodTypeModule {}