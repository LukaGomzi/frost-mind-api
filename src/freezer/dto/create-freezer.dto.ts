import { IsAlphanumeric, IsNotEmpty, MinLength } from "class-validator";

export class CreateFreezerDto {
    @IsNotEmpty()
    @MinLength(3, { message: 'Freezer name must have at least 3 characters.' })
    @IsAlphanumeric(null, {
        message: 'Freezer name does not allow other than alpha numeric chars.',
    })
    name: string;
}