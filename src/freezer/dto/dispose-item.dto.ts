import { IsInt, IsNotEmpty } from "class-validator";

export class DisposeItemDto {
    @IsInt()
    @IsNotEmpty()
    itemId: number;

    @IsInt()
    @IsNotEmpty()
    quantity: number;
}
