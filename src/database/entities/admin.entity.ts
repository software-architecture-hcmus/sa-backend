import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToOne } from "typeorm"
//import { AuditableEntity } from "../../lib/entities/auditable.entity"


//TODO: remove this as saved in firestore
@Entity()
export class Admin {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text', nullable: false })
    name: string;

    @Column({ type: 'text', unique: true, nullable: false })
    phone: string;

    @Column({ type: 'text', nullable: false })
    account_id: string;
}
