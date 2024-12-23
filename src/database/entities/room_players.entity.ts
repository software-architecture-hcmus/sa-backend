import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Relation } from "typeorm"
import { AuditableEntity } from "../../lib/entities/auditable.entity"

@Entity()
export class RoomPlayers extends AuditableEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

}
