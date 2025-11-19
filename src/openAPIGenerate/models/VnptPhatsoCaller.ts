/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { VnptDonvi } from './VnptDonvi';
import type { VnptPhatsoQueue } from './VnptPhatsoQueue';
import type { VnptPhatsoRoom } from './VnptPhatsoRoom';
export type VnptPhatsoCaller = {
    id?: number;
    donviId?: number | null;
    callerName?: string | null;
    passVerify?: string | null;
    roomId?: number | null;
    room?: VnptPhatsoRoom;
    donvi?: VnptDonvi;
    calledQueues?: Array<VnptPhatsoQueue> | null;
};

