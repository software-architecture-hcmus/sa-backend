import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Relation } from "typeorm"
import { AuditableEntity } from "../../lib/entities/auditable.entity"

import { Voucher } from "./voucher.entity"
    
@Entity('voucher_codes')
export class VoucherCode extends AuditableEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'text', nullable: false})
    code: string;

    @Column({type: 'boolean', default: false })
    isClaimed: boolean;

    @ManyToOne(() => Voucher, voucher => voucher.voucher_codes)
    @JoinColumn({ name: 'voucher_id' })
    voucher: Relation<Voucher>;
}