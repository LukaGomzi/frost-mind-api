import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { FoodTypeService } from './food-type.service';
import { CreateFoodTypeDto } from "./dto/create-food-type.dto";
import { UpdateFoodTypeDto } from "./dto/update-food-type.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { GetUserId } from "../core/decorators/get-user-id.decorator";

@Controller('food-types')
export class FoodTypeController {
    constructor(private readonly foodTypeService: FoodTypeService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() createFoodTypeDto: CreateFoodTypeDto, @GetUserId() userId: number) {
        return this.foodTypeService.create(createFoodTypeDto, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    findAll(@GetUserId() userId: number) {
        return this.foodTypeService.findAllForUser(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    findOne(@Param('id') id: string, @GetUserId() userId: number) {
        return this.foodTypeService.findOne(+id, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    update(@Param('id') id: string, @Body() updateFoodTypeDto: UpdateFoodTypeDto, @GetUserId() userId: number) {
        return this.foodTypeService.update(+id, updateFoodTypeDto, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string, @GetUserId() userId: number) {
        return this.foodTypeService.remove(+id, userId);
    }
}
