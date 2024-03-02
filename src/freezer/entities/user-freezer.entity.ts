import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from "../../user/entities/user.entity";
import { Freezer } from "./freezer.entity";


@Entity()
export class UserFreezer {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.userFreezers)
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToOne(() => Freezer, freezer => freezer.userFreezers)
    @JoinColumn({ name: 'freezerId' })
    freezer: Freezer;
}
