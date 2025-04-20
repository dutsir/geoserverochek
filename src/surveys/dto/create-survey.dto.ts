import { IsString, IsNumber, IsOptional, IsEnum, IsDateString } from 'class-validator';

export enum SignMainType {
    SIGNAL = 'SIGNAL',
    CENTER = 'CENTER',
    GROUND = 'GROUND',
    PYRAMID = 'PYRAMID',
    STAND = 'STAND',
    POST = 'POST'
}

export enum SignalType {
    PYRAMID = 'PYRAMID',
    TOWER = 'TOWER',
    POLE = 'POLE'
}

export enum MaterialType {
    WOOD = 'WOOD',
    METAL = 'METAL',
    CONCRETE = 'CONCRETE'
}

export enum ShapeType {
    TRIANGLE = 'TRIANGLE',
    SQUARE = 'SQUARE',
    ROUND = 'ROUND'
}

export enum PresenceType {
    PRESENT = 'PRESENT',
    ABSENT = 'ABSENT'
}

export enum IntegrityType {
    INTACT = 'INTACT',
    DAMAGED = 'DAMAGED'
}

export enum OpennessType {
    OPEN = 'OPEN',
    CLOSED = 'CLOSED'
}

export enum ReadabilityType {
    READABLE = 'READABLE',
    UNREADABLE = 'UNREADABLE'
}

export enum SatelliteObservabilityType {
    POSSIBLE = 'POSSIBLE',
    IMPOSSIBLE = 'IMPOSSIBLE'
}

export class CreateSurveyDto {
    @IsString()
    workBy: string;

    @IsDateString()
    surveyDate: string;

    @IsString()
    federalSubject: string;

    @IsString()
    @IsOptional()
    markerIndex?: string;

    @IsString()
    markerName: string;

    @IsNumber()
    @IsOptional()
    placingYear?: number;

    @IsNumber()
    signHeight: number;

    @IsString()
    @IsOptional()
    centerType?: string;

    @IsNumber()
    @IsOptional()
    altitude?: number;

    @IsString()
    @IsOptional()
    trapezes?: string;

    @IsString()
    coordinates: string;

    @IsEnum(SignMainType)
    signMainType: SignMainType;

    @IsEnum(SignalType)
    @IsOptional()
    signalType?: SignalType;

    @IsEnum(MaterialType)
    @IsOptional()
    signMaterial?: MaterialType;

    @IsEnum(ShapeType)
    @IsOptional()
    signSides?: ShapeType;

    @IsEnum(MaterialType)
    @IsOptional()
    postType?: MaterialType;

    @IsEnum(PresenceType)
    signPresence: PresenceType;

    @IsEnum(IntegrityType)
    monolith1Integrity: IntegrityType;

    @IsEnum(OpennessType)
    monolith2Openness: OpennessType;

    @IsEnum(OpennessType)
    monoliths3And4Openness: OpennessType;

    @IsEnum(IntegrityType)
    outerSignIntegrity: IntegrityType;

    @IsEnum(IntegrityType)
    orp1Integrity: IntegrityType;

    @IsEnum(IntegrityType)
    orp2Integrity: IntegrityType;

    @IsEnum(ReadabilityType)
    trenchReadability: ReadabilityType;

    @IsEnum(SatelliteObservabilityType)
    satelliteObservability: SatelliteObservabilityType;

    @IsNumber()
    upperMarkBelowGroundHeight: number;

    @IsOptional()
    @IsString()
    exteriorPhotoUrl?: string;

    @IsOptional()
    @IsString()
    centerMarkPhotoUrl?: string;

    @IsString()
    @IsOptional()
    extraNotes?: string;

    @IsString()
    createdBy: string;
} 