import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  AUDITOR = 'AUDITOR',
  AUDIT_TARGET = 'AUDIT_TARGET',
  SYSTEM_ADMIN = 'SYSTEM_ADMIN',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password_hash: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Column()
  full_name: string;

  @Column({ nullable: true })
  mfa_secret: string;

  @Column({ default: false })
  mfa_enabled: boolean;

  @Column({ default: 0 })
  failed_login_attempts: number;

  @Column({ type: 'timestamp with time zone', nullable: true })
  locked_until: Date | null;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;
}
