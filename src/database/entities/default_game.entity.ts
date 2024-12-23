import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, Relation, OneToOne, BeforeInsert, OneToMany } from "typeorm";
import { AuditableEntity } from "../../lib/entities/auditable.entity";
import { GameTypes } from "./game_types.entity";
import { StatusGame } from "../enums/game-status.enum";
import { Games } from "./games.entity";


@Entity()
export class DefaultGames extends AuditableEntity {
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

    @OneToOne(() => GameTypes, gameType => gameType.default_game, { eager: true })
    @JoinColumn({ name: 'type_id' }) // type_id làm khóa ngoại
    game_type: Relation<GameTypes>;

    @OneToMany(() => Games, games => games.id)
    @JoinColumn({ name: 'default_game_id' })
    games: Relation<Games>[];

    @BeforeInsert()
    setDefaults() {
        this.allow_voucher_exchange = this.allow_voucher_exchange ?? false;
    }
}
