import { UUID } from "crypto";
import { UUIDV4 } from "sequelize";
import { AllowNull, Column, DataType, Default, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Project } from "../project/project.entity";

@Table
export class User extends Model<User> {
    @PrimaryKey
    @Default(UUIDV4)
    @Column(DataType.UUID)
    id: UUID;

    @AllowNull(false)
    @Column(DataType.STRING)
    username: string;
    
    @AllowNull(false)
    @Column(DataType.STRING)
    password: string;

    @Column(DataType.STRING)
    firstName: string;

    @Column(DataType.STRING)
    lastName: string;

    @HasMany(() => Project)
    projects: Project[];
}