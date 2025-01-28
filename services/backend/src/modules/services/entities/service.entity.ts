import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';

@Entity()
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column('decimal')
  price: number;

  @Column()
  duration: number;

  @ManyToOne(() => Category, (category) => category.services, { eager: false })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column()
  providerId: string;

  @Column()
  username: string;
}
