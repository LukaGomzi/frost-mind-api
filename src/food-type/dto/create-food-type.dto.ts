import { IsInt, IsString, Min, MinLength, IsOptional } from 'class-validator';
import { User } from "../../user/entities/user.entity";

export class CreateFoodTypeDto {
    @IsString()
    @MinLength(2, { message: 'The name must be at least 2 characters long.' })
    name: string;

    @IsInt()
    @Min(1, { message: 'Expiration must be at least 1 month.' })
    expirationMonths: number;
}
