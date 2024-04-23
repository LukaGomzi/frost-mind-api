import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { FreezerService } from './freezer.service';
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CreateFreezerDto } from "./dto/create-freezer.dto";
import { UpdateFreezerDto } from "./dto/update-freezer.dto";
import { GetUserId } from "../core/decorators/get-user-id.decorator";
import { AddItemDto } from "./dto/add-item.dto";
import { FoodItemService } from "./food-item.service";
import { TakeItemOutDto } from "./dto/take-item-out.dto";


@Controller('freezers')
export class FreezerController {
    constructor(private readonly freezerService: FreezerService, private readonly foodItemService: FoodItemService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() createFreezerDto: CreateFreezerDto, @GetUserId() userId: number) {
        return this.freezerService.createFreezer(createFreezerDto.name, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':freezerId/users/:username')
    assignFreezerToUser(@Param('freezerId') freezerId: number, @Param('username') username: string, @GetUserId() userId: number) {
        return this.freezerService.assignFreezerToUser(freezerId, userId, username);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    findFreezers(@GetUserId() userId: number) {
        return this.freezerService.findFreezersByUser(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':freezerId')
    findFreezerById(@Param('freezerId') freezerId: number, @GetUserId() userId: number) {
        return this.freezerService.findFreezerByIdAndUser(freezerId, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':freezerId')
    updateFreezer(@Param('freezerId') freezerId: number, @Body() updateFreezerDto: UpdateFreezerDto, @GetUserId() userId: number) {
        return this.freezerService.updateFreezer(freezerId, userId, updateFreezerDto.name);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':freezerId')
    removeFreezer(@Param('freezerId') freezerId: number, @GetUserId() userId: number) {
        return this.freezerService.removeFreezer(freezerId, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':freezerId/users/:username')
    unassignFreezerFromUser(@Param('freezerId') freezerId: number, @Param('username') username: string, @GetUserId() userId: number) {
        return this.freezerService.unassignFreezerFromUser(freezerId, userId, username);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':freezerId/item')
    addItemToFreezer(@Param('freezerId') freezerId: number, @Body() addItemDto: AddItemDto, @GetUserId() userId: number) {
        return this.foodItemService.create(addItemDto, freezerId, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':freezerId/item/take-out')
    @HttpCode(HttpStatus.NO_CONTENT)
    async takeItemOutOfTheFreezer(
        @Param('freezerId') freezerId: number,
        @Body() takeItemOutDto: TakeItemOutDto,
        @GetUserId() userId: number
    ) {
        await this.foodItemService.takeItemFromFreezer(freezerId, takeItemOutDto, userId);
    }
}
