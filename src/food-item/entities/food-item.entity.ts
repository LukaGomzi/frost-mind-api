import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { FoodType } from "../../food-type/entities/food-type.entity";
import { User } from "../../user/entities/user.entity";

@Entity()
export class FoodItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToOne(() => FoodType)
    @JoinColumn({ name: 'foodTypeId' })
    foodType: FoodType;

    @Column()
    foodTypeId: number;

    @Column()
    quantity: number;

    @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
    weight: number | null;

    @Column({ type: 'date', nullable: true })
    expirationDate: Date | null;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'createdById' })
    createdBy: User;

    @Column({ nullable: true })
    createdById: number;
}

