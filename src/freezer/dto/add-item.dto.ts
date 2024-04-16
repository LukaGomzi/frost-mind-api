import { IsInt, IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';

export class AddItemDto {
    @IsInt()
    @IsNotEmpty()
    foodTypeId: number;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsInt()
    @IsOptional()
    @ValidateIf((o) => !o.quantity)
    weight?: number;

    @IsInt()
    @IsOptional()
    @ValidateIf((o) => !o.weight)
    quantity?: number;
}
