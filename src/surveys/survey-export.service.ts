import { Injectable } from '@nestjs/common';
import createReport from 'docx-templates';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';

export interface SurveyExportData {
    id: number;
    workBy: string;
    surveyYear: number;
    surveyDate: string;
    federalSubject: string;
    markerIndex?: string;
    markerName?: string;
    placingYear?: number;
    signType?: string;
    signHeight?: number;
    centerType?: string;
    altitude?: number;
    trapezes?: string;
    signPresence?: string;
    signPresenceRecom?: string;
    monolith1Integrity?: string;
    monolith1IntegrityRecom?: string;
    monolith2Openness?: string;
    monolith2OpennessRecom?: string;
    monoliths3And4Openness?: string;
    monoliths3And4OpennessRecom?: string;
    outerSignIntegrity?: string;
    outerSignIntegrityRecom?: string;
    orp1Integrity?: string;
    orp1IntegrityRecom?: string;
    orp2Integrity?: string;
    orp2IntegrityRecom?: string;
    trenchReadability?: string;
    trenchReadabilityRecom?: string;
    satelliteObservability?: string;
    upperMarkBelowGroundHeight?: number;
    aboveOrBelow?: string;
    createdBy?: string;
    createdAt?: string;
    approvedBy?: string;
    approvedAt?: string;
    centerMarkPhotoBuffer?: Buffer;
    exteriorPhotoBuffer?: Buffer;
}

@Injectable()
export class SurveyExportService {
    async exportToDocx(survey: SurveyExportData): Promise<Buffer> {
        const templatePath = path.join(process.cwd(), 'surveyCardTemplate.docx');
        const template = fs.readFileSync(templatePath);

        const docBuffer = await createReport({
            template,
            data: {
                $surveyDate: survey.surveyYear.toString(),
                $workBy: survey.workBy,
                $markerIndex: survey.markerIndex || '',
                $markerName: survey.markerName || '',
                $placingYear: survey.placingYear || '',
                $signType: survey.signType || '',
                $signHeight: survey.signHeight || '',
                $centerType: survey.centerType || '',
                $altitude: survey.altitude || '',
                $trapezes: survey.trapezes || '',
                $federalSubject: survey.federalSubject || '',

                $signPresence: survey.signPresence || '',
                $signPresenceRecom: survey.signPresenceRecom || '',
                $monolith1Integrity: survey.monolith1Integrity || '',
                $monolith1IntegrityRecom: survey.monolith1IntegrityRecom || '',
                $monolith2Openness: survey.monolith2Openness || '',
                $monolith2OpennessRecom: survey.monolith2OpennessRecom || '',
                $monoliths3And4Openness: survey.monoliths3And4Openness || '',
                $monoliths3And4OpennessRecom: survey.monoliths3And4OpennessRecom || '',
                $outerSignIntegrity: survey.outerSignIntegrity || '',
                $outerSignIntegrityRecom: survey.outerSignIntegrityRecom || '',
                $orp1Integrity: survey.orp1Integrity || '',
                $orp1IntegrityRecom: survey.orp1IntegrityRecom || '',
                $orp2Integrity: survey.orp2Integrity || '',
                $orp2IntegrityRecom: survey.orp2IntegrityRecom || '',
                $trenchReadability: survey.trenchReadability || '',
                $trenchReadabilityRecom: survey.trenchReadabilityRecom || '',

                $aboveOrBelow: survey.aboveOrBelow || '',
                $upperMarkBelowGroundHeight: survey.upperMarkBelowGroundHeight || '',
                $satelliteObservability: survey.satelliteObservability || '',

                $createdBy: survey.createdBy || '',
                $createdAt: survey.createdAt || '',
                $approvedBy: survey.approvedBy || '',
                $approvedAt: survey.approvedAt || '',
            },
            additionalJsContext: {
                centerMarkPhoto: () => {
                    if (!survey.centerMarkPhotoBuffer) return null;
                    return { 
                        width: 15, // ширина в сантиметрах
                        height: 10, // высота в сантиметрах
                        data: survey.centerMarkPhotoBuffer, 
                        extension: '.png',
                        scaling: 0.5
                    };
                },
                exteriorPhoto: () => {
                    if (!survey.exteriorPhotoBuffer) return null;
                    return { 
                        width: 15, // ширина в сантиметрах
                        height: 10, // высота в сантиметрах
                        data: survey.exteriorPhotoBuffer, 
                        extension: '.png',
                        scaling: 0.5
                    };
                },
            },
        });

        return Buffer.from(docBuffer);
    }
} 