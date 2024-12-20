import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Relation } from "typeorm"
import { AuditableEntity } from "../../lib/entities/auditable.entity"
import { Event } from "./event.entity"

@Entity()
export class Favourite extends AuditableEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text', nullable: false })
    customer_id: string;

    @ManyToOne(() => Event, event => event.id)
    @JoinColumn({ name: 'event_id' })
    event: Relation<Event>;
}
