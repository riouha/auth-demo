import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class LoginLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  success: boolean;

  @Column()
  passwordless: boolean;

  @Column()
  userId: number;
  @ManyToOne(() => User)
  user: User;

  @CreateDateColumn({ type: 'timestamp' })
  date: Date;
}
