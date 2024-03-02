import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { DatabaseModule } from "./config/database/database.module";
import { AuthModule } from "./auth/auth.module";
import { FreezerModule } from './freezer/freezer.module';

@Module({
  imports: [
    UserModule,
    DatabaseModule,
    AuthModule,
    FreezerModule,
  ]
})
export class AppModule {}
