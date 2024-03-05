import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Equal, Not, Repository } from 'typeorm';
import { FoodType } from './entities/food-type.entity';
import { CreateFoodTypeDto } from "./dto/create-food-type.dto";
import { UpdateFoodTypeDto } from "./dto/update-food-type.dto";
import { FoodTypeResponseDto } from "./dto/food-type-response.dto";

@Injectable()
export class FoodTypeService {
    constructor(
        @InjectRepository(FoodType)
        private readonly foodTypeRepository: Repository<FoodType>,
    ) {}

    async create(createFoodTypeDto: CreateFoodTypeDto, userId: number | null): Promise<FoodType> {
        const existingFoodTypes = await this.foodTypeRepository.find({
            where: { name: createFoodTypeDto.name },
        });

        const userSpecificDuplicate = existingFoodTypes.some(ft => ft.createdById === userId);
        if (userSpecificDuplicate) {
            throw new Error('A FoodType with this name already exists for this user.');
        }

        if (userId === null) {
            const genericDuplicate = existingFoodTypes.some(ft => ft.createdById === null);
            if (genericDuplicate) {
                throw new Error('A generic FoodType with this name already exists.');
            }
        }

        const foodType = this.foodTypeRepository.create({
            ...createFoodTypeDto,
            createdById: userId,
        });

        return this.foodTypeRepository.save(foodType);
    }

    async findAllForUser(userId: number): Promise<FoodTypeResponseDto[]> {
        const foodTypes = await this.foodTypeRepository.createQueryBuilder('foodType')
            .leftJoinAndSelect('foodType.createdBy', 'user')
            .where('foodType.createdById = :userId OR foodType.createdById IS NULL', { userId })
            .orderBy('foodType.createdById', 'DESC')
            .getMany();

        const uniqueFoodTypesMap = new Map();

        foodTypes.forEach(ft => {
            if (!uniqueFoodTypesMap.has(ft.name) || ft.createdById === userId) {
                uniqueFoodTypesMap.set(ft.name, ft);
            }
        });

        return Array.from(uniqueFoodTypesMap.values()).map(ft =>
            new FoodTypeResponseDto(ft));

    }

    async findOne(id: number, userId: number): Promise<FoodType> {
        const foodType = await this.foodTypeRepository.createQueryBuilder('foodType')
            .where('foodType.id = :id', { id })
            .andWhere(new Brackets(qb => {
                qb.where('foodType.createdById IS NULL')
                    .orWhere('foodType.createdById = :userId', { userId });
            }))
            .getOne();

        if (!foodType) {
            throw new NotFoundException(`FoodType with ID "${id}" not found or you do not have access to it.`);
        }

        return foodType;
    }


    async update(id: number, updateFoodTypeDto: UpdateFoodTypeDto, userId: number): Promise<FoodType> {
        const foodType = await this.foodTypeRepository.findOne({
            where: { id, createdById: userId },
        });

        if (!foodType) {
            throw new Error('FoodType not found or you do not have permission to edit this FoodType.');
        }

        if (updateFoodTypeDto.name) {
            const existingFoodType = await this.foodTypeRepository.findOne({
                where: {
                    id: Not(Equal(id)),
                    name: updateFoodTypeDto.name,
                    createdById: userId,
                },
            });

            if (existingFoodType) {
                throw new Error('Another FoodType with this name already exists under your account.');
            }
        }

        Object.assign(foodType, updateFoodTypeDto);
        return this.foodTypeRepository.save(foodType);
    }

    async remove(id: number, userId: number): Promise<void> {
        const foodType = await this.foodTypeRepository.findOne({
            where: { id, createdById: userId },
        });

        if (!foodType) {
            throw new Error('FoodType not found or you do not have permission to delete this FoodType.');
        }

        const result = await this.foodTypeRepository.delete(id);

        if (result.affected === 0) {
            throw new NotFoundException(`FoodType with ID "${id}" not found`);
        }
    }

}
