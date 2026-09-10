import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum RiskLevel {
  THAP = 'THAP',
  TRUNG_BINH = 'TRUNG_BINH',
  CAO = 'CAO',
  NGHIEM_TRONG = 'NGHIEM_TRONG',
}

export enum ActionPlanStatus {
  CHUA_XU_LY = 'CHUA_XU_LY',
  DANG_XU_LY = 'DANG_XU_LY',
  DA_KHAC_PHUC = 'DA_KHAC_PHUC',
  QUA_HAN = 'QUA_HAN',
}

@Entity('bks_audit_findings')
export class AuditFinding {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  title: string;

  // Mô tả nhạy cảm về rủi ro sẽ được encrypt/decrypt ở tầng Service trước khi lưu/sau khi query
  @Column({ type: 'bytea', nullable: true })
  description_encrypted: Buffer;

  @Column({ type: 'enum', enum: RiskLevel })
  risk_level: RiskLevel;

  @Column({ type: 'enum', enum: ActionPlanStatus, default: ActionPlanStatus.CHUA_XU_LY })
  action_plan_status: ActionPlanStatus;

  @Column({ type: 'date' })
  target_deadline: Date;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;
}
