import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { join } from "path";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT, 10),
            password: process.env.DB_PASS,
            username: process.env.DB_USER,
            entities: [join(__dirname, '../..', '**', '*.entity{.ts,.js}')],
            database: process.env.DB_NAME,
            synchronize: process.env.SYNCHRONIZE == 'true',
            logging: true,
        }),
    ]
})
export class DatabaseModule {}