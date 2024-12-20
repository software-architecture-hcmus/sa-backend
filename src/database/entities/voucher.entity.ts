import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { AuditableEntity } from "../../lib/entities/auditable.entity"
import { Event } from "./event.entity"

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

    @Column({type: 'text', nullable: false})
    status: string;

    @ManyToOne(() => Event, event => event.id)
    event: Event;
}
