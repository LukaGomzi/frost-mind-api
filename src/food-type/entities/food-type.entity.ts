import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Unique, OneToMany } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { FoodItem } from "../../freezer/entities/food-item.entity";

@Entity()
@Unique(['name', 'createdById'])
export class FoodType {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    expirationMonths: number;

    @Column({ nullable: true })
    createdById: number;

    @ManyToOne(() => User, user => user.foodTypes, { nullable: true })
    @JoinColumn({ name: 'createdById' })
    createdBy: User;

    @OneToMany(() => FoodItem, foodItem => foodItem.foodType)
    foodItems: FoodItem[];
}