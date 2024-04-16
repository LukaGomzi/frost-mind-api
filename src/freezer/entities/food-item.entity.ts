import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { FoodType } from "../../food-type/entities/food-type.entity";
import { Freezer } from "./freezer.entity";

@Entity()
export class FoodItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    food_type_id: number;

    @Column()
    freezer_id: number;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @Column({ type: 'decimal', nullable: true })
    weight?: number;

    @Column({ type: 'int', nullable: true })
    quantity?: number;

    @Column({ type: 'date'})
    expirationDate: Date;

    @ManyToOne(() => FoodType)
    @JoinColumn({ name: 'food_type_id' })
    foodType: FoodType;

    @ManyToOne(() => Freezer)
    @JoinColumn({ name: 'freezer_id' })
    freezer: Freezer;
}
