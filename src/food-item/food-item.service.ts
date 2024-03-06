import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FoodItem } from "./entities/food-item.entity";
import { Repository } from "typeorm";
import { CreateFoodItemDto } from "./dto/create-food-item.dto";
import { UpdateFoodItemDto } from "./dto/update-food-item.dto";
import { FoodTypeService } from "../food-type/food-type.service";

@Injectable()
export class FoodItemService {
    constructor(
        @InjectRepository(FoodItem)
        private readonly foodItemRepository: Repository<FoodItem>,
        private readonly foodTypeService: FoodTypeService,
    ) {}

    async create(createFoodItemDto: CreateFoodItemDto, userId: number): Promise<FoodItem> {
        const foodType = await this.foodTypeService.findOne(createFoodItemDto.foodTypeId, userId);
        if (!foodType) {
            throw new NotFoundException(`FoodType with ID "${createFoodItemDto.foodTypeId}" not found.`);
        }

        const expirationDate = new Date();
        expirationDate.setMonth(expirationDate.getMonth() + foodType.expirationMonths);

        const foodItem = this.foodItemRepository.create({
            ...createFoodItemDto,
            expirationDate: expirationDate,
            createdById: userId,
        });

        return this.foodItemRepository.save(foodItem);
    }


    async findAll(userId: number): Promise<FoodItem[]> {
        return this.foodItemRepository.find({ where: { createdById: userId } });
    }

    async findOne(id: number, userId: number): Promise<FoodItem> {
        const foodItem = await this.foodItemRepository.findOne({ where: { id, createdById: userId } });
        if (!foodItem) {
            throw new NotFoundException(`FoodItem with ID "${id}" not found.`);
        }
        return foodItem;
    }

    async update(id: number, updateFoodItemDto: UpdateFoodItemDto, userId: number): Promise<FoodItem> {
        const foodItem = await this.findOne(id, userId);
        Object.assign(foodItem, updateFoodItemDto);
        return this.foodItemRepository.save(foodItem);
    }

    async remove(id: number, userId: number): Promise<void> {
        const result = await this.foodItemRepository.delete({ id, createdById: userId });
        if (result.affected === 0) {
            throw new NotFoundException(`FoodItem with ID "${id}" not found.`);
        }
    }
}