import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';
import { Restaurant } from '../restaurant/restaurant.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Restaurant)
  restaurant: Restaurant;

  @Column('jsonb')
  items: Array<{ item: string, quantity: number }>;

  @Column()
  total: number;

  @Column()
  status: string;
}
