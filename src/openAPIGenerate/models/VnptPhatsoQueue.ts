/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { VnptPhatsoCaller } from './VnptPhatsoCaller';
import type { VnptPhatsoRoom } from './VnptPhatsoRoom';
export type VnptPhatsoQueue = {
    id?: number;
    numOrder?: number | null;
    isCalled?: boolean | null;
    roomId?: number | null;
    callerId?: number | null;
    donviId: number;
    callTime?: string | null;
    isEmergency?: boolean | null;
    isBackup?: boolean | null;
    createdTime?: string | null;
    room?: VnptPhatsoRoom;
    caller?: VnptPhatsoCaller;
};

