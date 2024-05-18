import { Injectable } from '@nestjs/common';
import * as cron from 'node-cron';
import { getConnection } from 'typeorm';
import { MailerService } from '../mailer/mailer.service';
import { FoodItem } from "../freezer/entities/food-item.entity";
import { User } from "../user/entities/user.entity";

@Injectable()
export class CronService {
    constructor(private readonly mailerService: MailerService) {
        cron.schedule('0 0 * * *', () => {
            this.checkExpiringItems();
        });
    }

    async checkExpiringItems() {
        const now = new Date();
        const oneMonthAhead = new Date();
        oneMonthAhead.setMonth(now.getMonth() + 1);

        const twoWeeksAhead = new Date();
        twoWeeksAhead.setDate(now.getDate() + 14);

        const expiringItems = await getConnection()
            .getRepository(FoodItem)
            .createQueryBuilder('foodItem')
            .leftJoinAndSelect('foodItem.freezer', 'freezer')
            .leftJoinAndSelect('freezer.userFreezers', 'userFreezer')
            .leftJoinAndSelect('userFreezer.user', 'user')
            .where('foodItem.expirationDate BETWEEN :twoWeeksAhead AND :oneMonthAhead', { twoWeeksAhead, oneMonthAhead })
            .getMany();

        const userNotifications = new Map<number, { user: User, items: FoodItem[] }>();

        expiringItems.forEach(item => {
            item.freezer.userFreezers.forEach(userFreezer => {
                const userId = userFreezer.user.id;
                if (!userNotifications.has(userId)) {
                    userNotifications.set(userId, { user: userFreezer.user, items: [] });
                }
                userNotifications.get(userId).items.push(item);
            });
        });

        for (const [userId, { user, items }] of userNotifications) {
            const emailText = items.map(item => `${item.name} (expires on ${item.expirationDate.toDateString()})`).join('\n');
            await this.mailerService.sendMail(
                user.email,
                'Food Items Expiration Notice',
                'The following items in your freezer are expiring soon:',
                `<p>The following items in your freezer are expiring soon:</p><ul>${items.map(item => `<li>${item.name} (expires on ${item.expirationDate.toDateString()})</li>`).join('')}</ul>`
            );
        }
    }
}
