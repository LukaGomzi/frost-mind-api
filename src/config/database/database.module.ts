import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { join } from "path";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DBPSQL_HOST,
            port: parseInt(process.env.DBPSQL_PORT, 10),
            password: process.env.DBPSQL_PASS,
            username: process.env.DBPSQL_USER,
            entities: [join(__dirname, '../..', '**', '*.entity{.ts,.js}')],
            database: process.env.DBPSQL_NAME,
            synchronize: process.env.SYNCHRONIZE == 'true',
            logging: true,
            ssl: {rejectUnauthorized: false},
        }),
    ]
})
export class DatabaseModule {}