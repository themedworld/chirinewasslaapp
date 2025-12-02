import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  numtel?: string;


  @Column({ type: 'date', nullable: true })
  birthdate?: string;

  @Column({ nullable: true })
  genre?: 'male' | 'female';

  @Column({ nullable: true })
  profilePicture?: string;

  @Column({ nullable: true })
  coverPhoto?: string;
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
 

}
