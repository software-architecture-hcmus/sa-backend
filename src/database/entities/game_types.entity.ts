import { Entity, PrimaryColumn, Relation, OneToOne } from "typeorm";
import { AuditableEntity } from "../../lib/entities/auditable.entity";
import { DefaultGames } from "./default_game.entity";
import { GameTypeID } from "../enums/game-id.enum";


@Entity()
export class GameTypes extends AuditableEntity {
    @PrimaryColumn({
        type: "enum",
        enum: GameTypeID,
        enumName: 'default_game_enum',
    })
    id: GameTypeID;

    @OneToOne(() => DefaultGames, defaultGame => defaultGame.game_type)
    default_game: Relation<DefaultGames>;
}
