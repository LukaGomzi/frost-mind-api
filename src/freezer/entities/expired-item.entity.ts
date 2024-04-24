import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { FoodType } from "../../food-type/entities/food-type.entity";
import { Freezer } from "./freezer.entity";

@Entity()
export class ExpiredItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column('decimal', { nullable: true })
    weight: number;

    @Column('int')
    quantity: number;

    @Column('timestamp')
    disposedDate: Date = new Date();

    @Column()
    foodTypeId: number;

    @ManyToOne(() => FoodType)
    @JoinColumn({ name: 'foodTypeId' })
    foodType: FoodType;

    @Column()
    freezerId: number;

    @ManyToOne(() => Freezer)
    @JoinColumn({ name: 'freezerId' })
    freezer: Freezer;
}
