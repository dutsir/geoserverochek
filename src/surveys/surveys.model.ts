import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { SignMainType, SignalType, MaterialType, ShapeType, PresenceType, IntegrityType, OpennessType, ReadabilityType, SatelliteObservabilityType } from './dto/create-survey.dto';

@Table({ tableName: 'surveys' })
export class Survey extends Model<Survey> {
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number;

    @Column({ type: DataType.STRING, allowNull: false })
    workBy: string;

    @Column({ type: DataType.DATEONLY, allowNull: false })
    surveyDate: string;

    @Column({ type: DataType.STRING, allowNull: false })
    federalSubject: string;

    @Column({ type: DataType.STRING })
    markerIndex: string;

    @Column({ type: DataType.STRING, allowNull: false })
    markerName: string;

    @Column({ type: DataType.INTEGER })
    placingYear: number;

    @Column({ type: DataType.FLOAT, allowNull: false })
    signHeight: number;

    @Column({ type: DataType.STRING })
    centerType: string;

    @Column({ type: DataType.FLOAT })
    altitude: number;

    @Column({ type: DataType.STRING })
    trapezes: string;

    @Column({ type: DataType.STRING, allowNull: false })
    coordinates: string;

    @Column({ 
        type: DataType.ENUM(...Object.values(SignMainType)),
        allowNull: false 
    })
    signMainType: SignMainType;

    @Column({ type: DataType.ENUM(...Object.values(SignalType)) })
    signalType: SignalType;

    @Column({ type: DataType.ENUM(...Object.values(MaterialType)) })
    signMaterial: MaterialType;

    @Column({ type: DataType.ENUM(...Object.values(ShapeType)) })
    signSides: ShapeType;

    @Column({ type: DataType.ENUM(...Object.values(MaterialType)) })
    postType: MaterialType;

    @Column({ 
        type: DataType.ENUM(...Object.values(PresenceType)),
        allowNull: false 
    })
    signPresence: PresenceType;

    @Column({ 
        type: DataType.ENUM(...Object.values(IntegrityType)),
        allowNull: false 
    })
    monolith1Integrity: IntegrityType;

    @Column({ 
        type: DataType.ENUM(...Object.values(OpennessType)),
        allowNull: false 
    })
    monolith2Openness: OpennessType;

    @Column({ 
        type: DataType.ENUM(...Object.values(OpennessType)),
        allowNull: false 
    })
    monoliths3And4Openness: OpennessType;

    @Column({ 
        type: DataType.ENUM(...Object.values(IntegrityType)),
        allowNull: false 
    })
    outerSignIntegrity: IntegrityType;

    @Column({ 
        type: DataType.ENUM(...Object.values(IntegrityType)),
        allowNull: false 
    })
    orp1Integrity: IntegrityType;

    @Column({ 
        type: DataType.ENUM(...Object.values(IntegrityType)),
        allowNull: false 
    })
    orp2Integrity: IntegrityType;

    @Column({ 
        type: DataType.ENUM(...Object.values(ReadabilityType)),
        allowNull: false 
    })
    trenchReadability: ReadabilityType;

    @Column({ 
        type: DataType.ENUM(...Object.values(SatelliteObservabilityType)),
        allowNull: false 
    })
    satelliteObservability: SatelliteObservabilityType;

    @Column({ type: DataType.FLOAT, allowNull: false })
    upperMarkBelowGroundHeight: number;

    @Column({ type: DataType.STRING, allowNull: true })
    exteriorPhoto: string | null;

    @Column({ type: DataType.STRING, allowNull: true })
    centerMarkPhoto: string | null;

    @Column({ type: DataType.TEXT })
    extraNotes: string;

    @Column({ type: DataType.STRING, allowNull: false })
    createdBy: string;
} 