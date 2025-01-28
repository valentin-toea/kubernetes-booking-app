import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  serviceId: string;

  @Column()
  userId: string;

  @Column('timestamp')
  date: Date;

  @Column()
  time: string;

  @Column()
  status: string; // pending, confirmed, canceled

  @Column({ nullable: true })
  notes: string;
}
