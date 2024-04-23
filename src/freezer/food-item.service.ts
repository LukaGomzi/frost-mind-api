import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FoodItem } from "./entities/food-item.entity";
import { Repository } from "typeorm";
import { FoodTypeService } from "../food-type/food-type.service";
import { AddItemDto } from "./dto/add-item.dto";
import { FreezerService } from "./freezer.service";
import { TakeItemOutDto } from "./dto/take-item-out.dto";
import { Freezer } from "./entities/freezer.entity";
import { TakenItem } from "./entities/taken-item.entity";

@Injectable()
export class FoodItemService {
    constructor(
        @InjectRepository(FoodItem)
        private readonly foodItemRepository: Repository<FoodItem>,
        @InjectRepository(TakenItem)
        private readonly takenItemRepository: Repository<TakenItem>,
        private readonly foodTypeService: FoodTypeService,
        private readonly freezerService: FreezerService,
    ) {}

    async create(addItemDto: AddItemDto, freezerId: number, userId: number): Promise<FoodItem> {
        const foodType = await this.foodTypeService.findOne(addItemDto.foodTypeId, userId);
        if (!foodType) {
            throw new NotFoundException(`FoodType with ID "${addItemDto.foodTypeId}" not found.`);
        }

        const freezer = await this.getUserFreezer(freezerId, userId);
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

    async takeItemFromFreezer(freezerId: number, takeItemOutDto: TakeItemOutDto, userId: number): Promise<void> {
        const freezer = await this.getUserFreezer(freezerId, userId);
        if (!freezer) {
            throw new NotFoundException(`Freezer with ID "${freezerId}" doesn't exist or user with ID "${userId}", doesn't have permission for it!`);
        }

        const item = await this.foodItemRepository.findOne({
            where: {
                id: takeItemOutDto.itemId,
                freezer_id: freezerId
            }
        });

        if (!item) {
            throw new NotFoundException(`Item with ID "${takeItemOutDto.itemId}" not found in freezer ID "${freezerId}".`);
        }

        if (item.quantity && takeItemOutDto.quantity && item.quantity < takeItemOutDto.quantity) {
            throw new Error('Not enough quantity available to take out.');
        }

        // Create a record for the taken item
        const takenItem = new TakenItem();
        takenItem.name = item.name;
        takenItem.weight = item.weight;
        takenItem.quantity = takeItemOutDto.quantity;
        takenItem.foodTypeId = item.food_type_id;
        takenItem.freezerId = freezerId;

        await this.takenItemRepository.save(takenItem);

        // Update or remove the FoodItem based on the remaining quantity
        if (item.quantity > takeItemOutDto.quantity) {
            item.quantity -= takeItemOutDto.quantity;
            await this.foodItemRepository.save(item);
        } else {
            await this.foodItemRepository.remove(item);
        }
    }



    private async getUserFreezer(freezerId: number, userId: number): Promise<Freezer | undefined> {
        const freezer = await this.freezerService.findFreezerByIdAndUser(freezerId, userId);
        return freezer || undefined;
    }
}