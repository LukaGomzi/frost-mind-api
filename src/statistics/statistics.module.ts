import { Module } from "@nestjs/common";
import { StatisticsService } from "./statistics.service";
import { StatisticsController } from "./statistics.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TakenItem } from "../freezer/entities/taken-item.entity";
import { ExpiredItem } from "../freezer/entities/expired-item.entity";
import { UserFreezer } from "../freezer/entities/user-freezer.entity";

@Module({
    imports: [TypeOrmModule.forFeature([TakenItem, ExpiredItem, UserFreezer])],
    providers: [StatisticsService],
    controllers: [StatisticsController],
})
export class StatisticsModule {}
