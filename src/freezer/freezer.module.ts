import { Module } from '@nestjs/common';
import { FreezerService } from './freezer.service';
import { FreezerController } from './freezer.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Freezer } from "./entities/freezer.entity";
import { UserFreezer } from "./entities/user-freezer.entity";
import { UserModule } from "../user/user.module";

@Module({
  imports: [
      TypeOrmModule.forFeature([Freezer, UserFreezer]),
      UserModule
  ],
  providers: [FreezerService],
  controllers: [FreezerController]
})
export class FreezerModule {}
