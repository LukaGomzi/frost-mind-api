import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { UserFreezer } from "./user-freezer.entity";
import { FoodItem } from "./food-item.entity";

@Entity()
export class Freezer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @OneToMany(() => UserFreezer, userFreezer => userFreezer.freezer)
    userFreezers: UserFreezer[];

    @OneToMany(() => FoodItem, foodItem => foodItem.freezer)
    foodItems: FoodItem[];

    @CreateDateColumn()
    created_at: Date;
}
