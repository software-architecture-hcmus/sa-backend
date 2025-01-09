import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Relation, OneToMany } from "typeorm"
import { AuditableEntity } from "../../lib/entities/auditable.entity"
import { Voucher } from "./voucher.entity"
import { GameResults } from "./game_results.entity";
import { Transaction } from "./transactions.entity";

@Entity()
export class CustomerVoucher extends AuditableEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Voucher, voucher => voucher.customer_vouchers)
    @JoinColumn({name: 'voucher_id'})
    voucher: Relation<Voucher>;

    @ManyToOne(() => GameResults, gameResult => gameResult.customer_vouchers)
    @JoinColumn({name: 'game_result_id'})
    game_result: Relation<GameResults>;
    
    @Column({type: 'text', nullable: false})
    customer_id: string;

    @OneToMany(() => Transaction, transaction => transaction.customer_voucher)
    transactions: Relation<Transaction>[];

    @Column({type: 'boolean', nullable: true})
    code: string;
}