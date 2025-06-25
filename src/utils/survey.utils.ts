import { SignMainType, SignalType, PresenceType, IntegrityType, OpennessType, ReadabilityType, SatelliteObservabilityType } from '../surveys/dto/create-survey.dto';

export function getSignTypeString(signMainType: SignMainType, signalType?: SignalType): string {
    if (signMainType === SignMainType.SIGNAL && signalType) {
        return `${SignMainType.SIGNAL} - ${signalType}`;
    }
    return signMainType;
}

export function getStateString(state: PresenceType | IntegrityType | OpennessType | ReadabilityType | SatelliteObservabilityType): string {
    switch (state) {
        case PresenceType.PRESENT:
            return 'Присутствует';
        case PresenceType.ABSENT:
            return 'Отсутствует';
        case IntegrityType.INTACT:
            return 'Целостный';
        case IntegrityType.DAMAGED:
            return 'Поврежден';
        case OpennessType.OPEN:
            return 'Открыт';
        case OpennessType.CLOSED:
            return 'Закрыт';
        case ReadabilityType.READABLE:
            return 'Читаемый';
        case ReadabilityType.UNREADABLE:
            return 'Нечитаемый';
        case SatelliteObservabilityType.POSSIBLE:
            return 'Возможна';
        case SatelliteObservabilityType.IMPOSSIBLE:
            return 'Невозможна';
        default:
            return state;
    }
}

export function getRecoveryRecommendations(state: PresenceType | IntegrityType | OpennessType | ReadabilityType | SatelliteObservabilityType): string {
    switch (state) {
        case PresenceType.ABSENT:
            return 'Необходимо восстановить';
        case IntegrityType.DAMAGED:
            return 'Требуется ремонт';
        case OpennessType.CLOSED:
            return 'Необходимо открыть';
        case ReadabilityType.UNREADABLE:
            return 'Требуется очистка';
        case SatelliteObservabilityType.IMPOSSIBLE:
            return 'Требуется расчистка';
        default:
            return '';
    }
} 