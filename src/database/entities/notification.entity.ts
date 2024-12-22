import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Relation } from "typeorm"
import { AuditableEntity } from "../../lib/entities/auditable.entity"
import { Event } from "./event.entity"

@Entity()
export class Notification extends AuditableEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text', nullable: false })
    account_id: string;

    @Column({ type: 'text', nullable: false })
    content: string;

    @ManyToOne(() => Event, event => event.notifications)
    @JoinColumn({ name: 'event_id' })
    event: Relation<Event>;

}
