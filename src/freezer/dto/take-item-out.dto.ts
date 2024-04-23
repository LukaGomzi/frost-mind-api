import { IsInt, IsNotEmpty, IsOptional } from "class-validator";

export class TakeItemOutDto {
    @IsInt()
    @IsNotEmpty()
    itemId: number;

    @IsInt()
    @IsOptional()
    quantity?: number;
}
