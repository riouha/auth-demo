import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class SmsLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column({ default: false })
  used: boolean;

  @Column()
  userId: number;
  @ManyToOne(() => User)
  user: User;

  @CreateDateColumn({ type: 'timestamp' })
  date: Date;
}
