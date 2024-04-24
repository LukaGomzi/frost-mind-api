import { Controller, Get, UseGuards } from "@nestjs/common";
import { StatisticsService } from "./statistics.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { GetUserId } from "../core/decorators/get-user-id.decorator";

@Controller('statistics')
export class StatisticsController {
    constructor(
        private readonly statisticsService: StatisticsService
    ) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    async getUsersStatistic(@GetUserId() userId: number) {
        return await this.statisticsService.calculateUserStatistics(userId);
    }
}