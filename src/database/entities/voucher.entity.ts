import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Relation, OneToMany } from "typeorm"
import { AuditableEntity } from "../../lib/entities/auditable.entity"
import { Event } from "./event.entity"
import { CustomerVoucher } from "./customer_vouchers.entity";
import { VoucherCode } from "./voucher_codes.entity";

@Entity()
export class Voucher extends AuditableEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text', nullable: false })
    code: string;

    @Column({ type: 'text', nullable: true })
    qr_code: string;

    @Column({ type: 'text', nullable: true })
    image: string;

    @Column({ type: 'int', nullable: false })
    value: number;

    @Column({ type: 'text', nullable: false })
    description: string;

    @Column({type: 'timestamp', nullable: true})
    expiry_date: Date;

    @Column({type: 'text', nullable: true})
    status: string;

    @ManyToOne(() => Event, event => event.vouchers)
    @JoinColumn({ name: 'event_id' })
    event: Relation<Event>;

    @OneToMany(() => CustomerVoucher, customerVoucher => customerVoucher.voucher)
    customer_vouchers: Relation<CustomerVoucher>[];

    @OneToMany(() => VoucherCode, voucherCode => voucherCode.voucher)
    voucher_codes: Relation<VoucherCode>[];
}
