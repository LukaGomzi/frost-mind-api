import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Freezer } from './entities/freezer.entity';
import { UserFreezer } from "./entities/user-freezer.entity";
import { UserService } from "../user/user.service";
import { TakeItemOutDto } from "./dto/take-item-out.dto";

@Injectable()
export class FreezerService {
    constructor(
        @InjectRepository(Freezer)
        private readonly freezerRepository: Repository<Freezer>,
        private readonly userService: UserService,
        @InjectRepository(UserFreezer)
        private readonly userFreezerRepository: Repository<UserFreezer>,
    ) {}

    async createFreezer(name: string, userId: number): Promise<Freezer> {
        const user = await this.userService.viewUser(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const freezer = this.freezerRepository.create({ name });
        const savedFreezer = await this.freezerRepository.save(freezer);

        const userFreezer = this.userFreezerRepository.create({
            user,
            freezer: savedFreezer,
        });
        await this.userFreezerRepository.save(userFreezer);

        return savedFreezer;
    }

    async assignFreezerToUser(freezerId: number, userId: number, username: string): Promise<UserFreezer> {
        const userFreezer = await this.userFreezerRepository.findOne({
            where: {
                user: {
                    username: username
                },
                freezer: {
                    id: freezerId
                }
            }
        });

        if (userFreezer) {
            throw new ConflictException('This freezer is already assigned to the user');
        }

        const freezer = await this.findFreezerByIdAndUser(freezerId, userId);
        const user = await this.userService.findOne(username);

        if (!freezer || !user) {
            throw new NotFoundException('Freezer or User not found');
        }

        const newUserFreezer = this.userFreezerRepository.create({ freezer, user });
        return this.userFreezerRepository.save(newUserFreezer);
    }

    async findFreezersByUser(userId: number): Promise<Freezer[]> {
        const userFreezers = await this.userFreezerRepository.find({
            relations: {
                freezer: {
                    foodItems: true
                }
            },
            where: {
                user: {
                    id: userId
                }
            }
        });

        return userFreezers.map(userFreezer => userFreezer.freezer);
    }

    async findFreezerByIdAndUser(freezerId, userId): Promise<Freezer> {
        const userFreezer = await this.userFreezerRepository.findOne({
            relations: {
                freezer: {
                    foodItems: true
                }
            },
            where: {
                user: {
                    id: userId
                },
                freezer: {
                    id: freezerId
                }
            }
        });

        if (!userFreezer) {
            throw new NotFoundException(`Freezer with id ${freezerId} not found on user with id ${userId}!`);
        }

        return userFreezer.freezer || undefined;
    }

    async getUserFreezersByFreezerId(freezerId: number): Promise<UserFreezer[]> {
        const userFreezer = await this.userFreezerRepository.find({
            relations: {
                freezer: {
                    foodItems: true
                },
                user: true
            },
            where: {
                freezer: {
                    id: freezerId
                }
            }
        });

        if (!userFreezer) {
            throw new NotFoundException(`Freezer with id ${freezerId} not found!`);
        }

        return userFreezer;
    }

    async updateFreezer(freezerId: number, userId: number, newName: string): Promise<Freezer> {
        const freezer = await this.findFreezerByIdAndUser(freezerId, userId);
        if (!freezer) {
            throw new NotFoundException(`Freezer with id ${freezerId} not found on user with id ${userId}!`);
        }
        freezer.name = newName;
        return this.freezerRepository.save(freezer);
    }

    async removeFreezer(freezerId: number, userId: number): Promise<void> {
        const userFreezers = await this.getUserFreezersByFreezerId(freezerId);
        if (!this.userHasFreezerPermissions(userFreezers, userId)) {
            throw new NotFoundException('Freezer cant be deleted');
        }

        userFreezers.map(async (userFreezer) => {
            const deleteUserFreezerResult = await this.userFreezerRepository.delete(userFreezer);

            if (deleteUserFreezerResult.affected === 0) {
                throw new NotFoundException('User Freezer not found');
            }
        });

        const deleteResult = await this.freezerRepository.delete(freezerId);
        if (deleteResult.affected === 0) {
            throw new NotFoundException('Freezer not found');
        }
    }

    async unassignFreezerFromUser(freezerId: number, userId: number, username: string): Promise<void> {
        const currentUserFreezers = await this.getUserFreezersByFreezerId(freezerId);

        if (!this.userHasFreezerPermissions(currentUserFreezers, userId)) {
            throw new NotFoundException(`Cannot remove user ${username} from freezer with id ${freezerId}`);
        }

        const userFreezer = await this.userFreezerRepository.findOne({
            relations: {
                user: true
            },
            where: {
                freezer: { id: freezerId },
                user: { username: username },
            },
        });

        if (!userFreezer) {
            throw new NotFoundException('Freezer or User not found');
        }

        await this.userFreezerRepository.remove(userFreezer);
    }

    private userHasFreezerPermissions(userFreezers: UserFreezer[], userId: number): boolean {
        return userFreezers.some((userFreezer) => userFreezer.user.id === userId);
    }
}
