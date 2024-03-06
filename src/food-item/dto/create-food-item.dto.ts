import { IsNotEmpty, IsNumber, IsOptional, Min } from "class-validator";

export class CreateFoodItemDto {
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @Min(1)
    quantity: number;

    @IsNumber()
    @IsOptional()
    weight?: number;

    @IsNumber()
    @Min(1)
    foodTypeId: number;

    @IsNumber()
    @IsOptional()
    createdById?: number;
}