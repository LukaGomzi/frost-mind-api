import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserFreezer } from "../../freezer/entities/user-freezer.entity";
import { FoodType } from "../../food-type/entities/food-type.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password_hash: string;

  @OneToMany(() => UserFreezer, userFreezer => userFreezer.user)
  userFreezers: UserFreezer[];

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => FoodType, foodType => foodType.createdBy)
  foodTypes: FoodType[];

  @Column({ nullable: true })
  refreshToken?: string;

  @Column({ nullable: true })
  confirmationToken: string;

  @Column({ default: false })
  isConfirmed: boolean;
}
