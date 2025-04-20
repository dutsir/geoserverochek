import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'markers' })
export class Marker extends Model<Marker> {
    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
    id: string;

    @Column({ 
        type: DataType.TEXT, 
        allowNull: false,
        validate: {
            isValidCoordinates(value: string) {
                const pattern = /^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/;
                if (!pattern.test(value)) {
                    throw new Error('Coordinates must be in format "latitude, longitude"');
                }
            }
        }
    })
    coordinates: string;

    @Column({ type: DataType.STRING, allowNull: false })
    title: string;

    @Column({ type: DataType.STRING, allowNull: false })
    description: string;

    @Column({ 
        type: DataType.ENUM('intact', 'damaged', 'needs_inspection'),
        allowNull: false,
        defaultValue: 'intact'
    })
    status: 'intact' | 'damaged' | 'needs_inspection';
} 