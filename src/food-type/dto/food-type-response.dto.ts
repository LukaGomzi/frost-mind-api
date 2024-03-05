export class FoodTypeResponseDto {
    id: number;
    name: string;
    expirationMonths: number;
    createdBy: {
        id: number;
        username: string;
        email: string;
        created_at: Date;
    };

    constructor(foodType: any) {
        this.id = foodType.id;
        this.name = foodType.name;
        this.expirationMonths = foodType.expirationMonths;
        this.createdBy = foodType.createdBy ? {
            id: foodType.createdBy.id,
            username: foodType.createdBy.username,
            email: foodType.createdBy.email,
            created_at: foodType.createdBy.created_at
        } : null;
    }
}
