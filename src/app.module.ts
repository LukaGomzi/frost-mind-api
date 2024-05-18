import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { DatabaseModule } from "./config/database/database.module";
import { AuthModule } from "./auth/auth.module";
import { FreezerModule } from './freezer/freezer.module';
import { FoodTypeModule } from "./food-type/food-type.module";
import { StatisticsModule } from "./statistics/statistics.module";
import { MailerModule } from "./mailer/mailer.module";
import { CronService } from "./cron/cron.service";

@Module({
  imports: [
    UserModule,
    DatabaseModule,
    AuthModule,
    FreezerModule,
    FoodTypeModule,
    StatisticsModule,
    MailerModule
  ],
  providers: [
    CronService
  ]
})
export class AppModule {}
