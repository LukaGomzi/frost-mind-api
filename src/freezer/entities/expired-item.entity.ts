import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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

    @Column()
    freezerId: number;
}
