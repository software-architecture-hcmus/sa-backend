import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { AuditableEntity } from "../../lib/entities/auditable.entity"
import { Voucher } from "./voucher.entity"

@Entity()
export class Event extends AuditableEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text', nullable: false })
    name: string;

    @Column({ type: 'text', nullable: true })
    image: string;

    @Column({ type: 'int', nullable: false })
    total_vouchers: number;

    @Column({type: 'timestamp', nullable: false})
    start: Date;

    @Column({type: 'timestamp', nullable: false})
    end: Date;

    @Column({type: 'text', nullable: false})
    brand_id: string;

    @OneToMany(() => Voucher, voucher => voucher.id)
    vouchers: Voucher[];
}
