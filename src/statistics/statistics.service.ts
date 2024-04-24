import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TakenItem } from "../freezer/entities/taken-item.entity";
import { In, Repository } from "typeorm";
import { ExpiredItem } from "../freezer/entities/expired-item.entity";
import { UserFreezer } from "../freezer/entities/user-freezer.entity";

export interface FoodGroup {
    foodType: string;
    items: {
        name: string;
        weight: number;
        packages: number;
    }[];
    totalWeight: number;
    totalPackages: number;
}

@Injectable()
export class StatisticsService {
    constructor(
        @InjectRepository(TakenItem)
        private takenItemRepository: Repository<TakenItem>,
        @InjectRepository(ExpiredItem)
        private expiredItemRepository: Repository<ExpiredItem>,
        @InjectRepository(UserFreezer)
        private userFreezerRepository: Repository<UserFreezer>
    ) {}

    async calculateUserStatistics(userId: number) {
        const userFreezers = await this.userFreezerRepository.find({
            where: { user: { id: userId } },
            relations: ['freezer']
        });

        const freezerIds = userFreezers.map(uf => uf.freezer.id);

        const takenItems = await this.takenItemRepository.find({
            where: { freezerId: In(freezerIds) },
            relations: ['foodType']
        });
        const usedStats = this.groupItemsByFoodType(takenItems);

        const expiredItems = await this.expiredItemRepository.find({
            where: { freezerId: In(freezerIds) },
            relations: ['foodType']
        });
        const disposedStats = this.groupItemsByFoodType(expiredItems);

        return {
            used: usedStats,
            disposed: disposedStats
        };
    }

    private groupItemsByFoodType(items: Array<TakenItem | ExpiredItem>): FoodGroup[] {
        const grouped: Record<string, FoodGroup> = items.reduce((acc, item) => {
            const key = item.foodType.name;
            if (!acc[key]) {
                acc[key] = {
                    foodType: key,
                    items: [],
                    totalWeight: 0,
                    totalPackages: 0
                };
            }

            const itemIndex = acc[key].items.findIndex(i => i.name === item.name);
            if (itemIndex !== -1) {
                acc[key].items[itemIndex].weight += item.quantity * item.weight;
                acc[key].items[itemIndex].packages += item.quantity;
            } else {
                acc[key].items.push({
                    name: item.name,
                    weight: item.quantity * item.weight,
                    packages: item.quantity
                });
            }
            acc[key].totalWeight += item.quantity * item.weight;
            acc[key].totalPackages += item.quantity;
            return acc;
        }, {});

        return Object.values(grouped);
    }
}