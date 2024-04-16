import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FoodItem } from "./entities/food-item.entity";
import { Repository } from "typeorm";
import { FoodTypeService } from "../food-type/food-type.service";
import { AddItemDto } from "./dto/add-item.dto";
import { FreezerService } from "./freezer.service";

@Injectable()
export class FoodItemService {
    constructor(
        @InjectRepository(FoodItem)
        private readonly foodItemRepository: Repository<FoodItem>,
        private readonly foodTypeService: FoodTypeService,
        private readonly freezerService: FreezerService,
    ) {}

    async create(addItemDto: AddItemDto, freezerId: number, userId: number): Promise<FoodItem> {
        const foodType = await this.foodTypeService.findOne(addItemDto.foodTypeId, userId);
        if (!foodType) {
            throw new NotFoundException(`FoodType with ID "${addItemDto.foodTypeId}" not found.`);
        }

        console.log('freezer id', freezerId)
        const freezer = await this.freezerService.findFreezerByIdAndUser(freezerId, userId);
        console.log('freezer', freezer)
        if (!freezer) {
            throw new NotFoundException(`Freezer with ID "${freezerId}" doesn't exist or user with ID "${userId}", doesn't have permission for it!`);
        }

        const expirationDate = new Date();
        expirationDate.setMonth(expirationDate.getMonth() + foodType.expirationMonths);

        const newFoodItem = this.foodItemRepository.create({
            food_type_id: addItemDto.foodTypeId,
            freezer_id: freezerId,
            name: addItemDto.name,
            description: addItemDto.description,
            weight: addItemDto.weight,
            quantity: addItemDto.quantity,
            expirationDate: expirationDate
        });

        return await this.foodItemRepository.save(newFoodItem);
    }
}