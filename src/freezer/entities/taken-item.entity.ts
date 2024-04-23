import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Freezer } from './freezer.entity';
import { FoodType } from "../../food-type/entities/food-type.entity";

@Entity()
export class TakenItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column('decimal', { nullable: true })
    weight: number;

    @Column('int')
    quantity: number;

    @Column('timestamp')
    takenDate: Date = new Date();

    @Column()
    foodTypeId: number;

    @Column()
    freezerId: number;

    @ManyToOne(() => FoodType)
    @JoinColumn({ name: 'foodTypeId' })
    foodType: FoodType;

    @ManyToOne(() => Freezer)
    @JoinColumn({ name: 'freezerId' })
    freezer: Freezer;
}