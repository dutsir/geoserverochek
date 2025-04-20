import { Column, Model, Table, DataType } from 'sequelize-typescript';

@Table({ tableName: 'surveys' })
export class Survey extends Model {
  @Column({ type: DataType.STRING, allowNull: false })
  workBy: string;

  @Column({ type: DataType.DATE, allowNull: false })
  surveyDate: Date;

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

  @Column({ type: DataType.STRING, allowNull: false })
  signMainType: string;

  @Column({ type: DataType.STRING })
  signalType: string;

  @Column({ type: DataType.STRING })
  signMaterial: string;

  @Column({ type: DataType.STRING })
  signSides: string;

  @Column({ type: DataType.STRING })
  postType: string;

  @Column({ type: DataType.STRING, allowNull: false })
  signPresence: string;

  @Column({ type: DataType.STRING, allowNull: false })
  monolith1Integrity: string;

  @Column({ type: DataType.STRING, allowNull: false })
  monolith2Openness: string;

  @Column({ type: DataType.STRING, allowNull: false })
  monoliths3And4Openness: string;

  @Column({ type: DataType.STRING, allowNull: false })
  outerSignIntegrity: string;

  @Column({ type: DataType.STRING, allowNull: false })
  orp1Integrity: string;

  @Column({ type: DataType.STRING, allowNull: false })
  orp2Integrity: string;

  @Column({ type: DataType.STRING, allowNull: false })
  trenchReadability: string;

  @Column({ type: DataType.STRING, allowNull: false })
  satelliteObservability: string;

  @Column({ type: DataType.FLOAT, allowNull: false })
  upperMarkBelowGroundHeight: number;

  @Column({ type: DataType.STRING })
  exteriorPhoto: string;

  @Column({ type: DataType.STRING })
  centerMarkPhoto: string;

  @Column({ type: DataType.TEXT })
  extraNotes: string;

  @Column({ type: DataType.STRING, allowNull: false })
  createdBy: string;
} 