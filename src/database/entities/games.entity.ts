import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, Relation, BeforeInsert, ManyToOne } from "typeorm";
import { AuditableEntity } from "../../lib/entities/auditable.entity";
import { StatusGame } from "../enums/game-status.enum";
import { DefaultGames } from "./default_game.entity";
import { Event } from "./event.entity"


@Entity()
export class Games extends AuditableEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text', nullable: false })
    name: string;

    @Column({ type: 'text', nullable: true })
    image: string;

    @Column({ type: 'boolean', nullable: false, default: false })
    allow_voucher_exchange: boolean;

    @Column({ type: 'text', nullable: true })
    instruction: string;

    @Column({ type: 'enum', enum: StatusGame, enumName: 'default_games_status_enum' })
    status: StatusGame;

    @ManyToOne(() => Event, event => event.games)
    @JoinColumn({ name: 'event_id' })
    event: Relation<Event>;

    @ManyToOne(() => DefaultGames, default_game => default_game.games)
    @JoinColumn({ name: 'default_game_id' })
    default_game: Relation<DefaultGames>;

    @BeforeInsert()
    setDefaults() {
        this.allow_voucher_exchange = this.allow_voucher_exchange ?? false;
    }
}
