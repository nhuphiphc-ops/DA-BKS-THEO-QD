import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum ResolutionIssuerLevel {
  DHDCD = 'DHDCD',
  HDQT = 'HDQT',
  TRUONG_BKS = 'TRUONG_BKS',
}

export enum ComplianceStatus {
  DUNG_THAM_QUYEN = 'DUNG_THAM_QUYEN',
  DANG_THUC_HIEN = 'DANG_THUC_HIEN',
  VI_PHAM = 'VI_PHAM',
}

@Entity('bks_governance_resolutions')
export class Resolution {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, unique: true })
  resolution_code: string;

  @Column({ type: 'enum', enum: ResolutionIssuerLevel })
  issuer_level: ResolutionIssuerLevel;

  @Column({ type: 'date' })
  issue_date: Date;

  @Column({ type: 'enum', enum: ComplianceStatus, default: ComplianceStatus.DUNG_THAM_QUYEN })
  compliance_status: ComplianceStatus;

  @Column({ type: 'bytea', nullable: true })
  bks_audit_notes_encrypted: Buffer;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;
}
