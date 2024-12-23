import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, Relation } from "typeorm"
import { AuditableEntity } from "../../lib/entities/auditable.entity"
import { Voucher } from "./voucher.entity"
import { Favourite } from "./favourite.entity"
import { Games } from "./games.entity";

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

    @OneToMany(() => Voucher, voucher => voucher.event)
    @JoinColumn({ name: 'event_id' })
    vouchers: Relation<Voucher>[];

    @OneToMany(() => Favourite, favourite => favourite.id)
    @JoinColumn({ name: 'event_id' })
    favourites: Relation<Favourite>[];

    @OneToMany(() => Games, games => games.id)
    @JoinColumn({ name: 'event_id' })
    games: Relation<Games>[];
}
