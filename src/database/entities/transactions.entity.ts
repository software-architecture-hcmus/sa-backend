import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Relation, OneToMany } from "typeorm"
import { AuditableEntity } from "../../lib/entities/auditable.entity"
import { CustomerVoucher } from "./customer_vouchers.entity";
import { TripleStatus } from "../enums/triple-status.enum";

@Entity()
export class Transaction extends AuditableEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'timestamptz', nullable: true})
    transaction_time: Date;

    @ManyToOne(() => CustomerVoucher, customerVoucher => customerVoucher.transactions)
    @JoinColumn({name: 'customer_voucher_id'})
    customer_voucher: Relation<CustomerVoucher>;

    @Column({type: 'text', nullable: false})
    sender_id: string;

    @Column({type: 'text', nullable: false})
    receiver_id: string;

    @Column({type: 'text', nullable: false})
    token: string;

    @Column({
        type: 'enum', 
        enum: TripleStatus,
        nullable: false, 
        default: 'PENDING'
    })
    status: TripleStatus;
}