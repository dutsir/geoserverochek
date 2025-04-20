import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'visits' })
export class Visit extends Model {
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    page: string;

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    timestamp: Date;
} 