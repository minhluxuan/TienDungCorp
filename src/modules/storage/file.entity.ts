import { UUID } from "crypto";
import { UUIDV4 } from "sequelize";
import { BelongsTo, Column, DataType, Default, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Project } from "../project/project.entity";

@Table
export class File extends Model<File> {
    @PrimaryKey
    @Default(UUIDV4)
    @Column(DataType.UUID)
    id: UUID;

    @Column(DataType.STRING)
    name: string;

    @Column(DataType.STRING)
    path: string;

    @ForeignKey(() => Project)
    @Column(DataType.UUID)
    projectId: UUID;

    @BelongsTo(() => Project)
    project: Project;
}