import { UUID } from "crypto";
import { UUIDV4 } from "sequelize";
import { BelongsTo, Column, DataType, Default, ForeignKey, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { NewsType } from "src/common/contants";
import { User } from "../user/user.entity";
import { File } from "../storage/file.entity";

@Table
export class Project extends Model<Project> {
    @PrimaryKey
    @Default(UUIDV4)
    @Column(DataType.UUID)
    id: UUID;

    @Column(DataType.STRING)
    name: string;

    @Column(DataType.STRING)
    title: string;

    @ForeignKey(() => User)
    @Column(DataType.UUID)
    authorId: UUID;

    @BelongsTo(() => User)
    user: User;

    @Column({
        type: DataType.ENUM(...Object.keys(NewsType)),
        allowNull: false
    })
    type: NewsType;

    @HasMany(() => File)
    files: File[];
}