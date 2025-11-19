/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { VnptDonvi } from './VnptDonvi';
import type { VnptPhatsoCaller } from './VnptPhatsoCaller';
import type { VnptPhatsoPrinterRoom } from './VnptPhatsoPrinterRoom';
import type { VnptPhatsoQueue } from './VnptPhatsoQueue';
import type { VnptPhatsoRoomGroup } from './VnptPhatsoRoomGroup';
export type VnptPhatsoRoom = {
    id?: number;
    donviId?: number | null;
    roomName?: string | null;
    roomGroupId?: number | null;
    enabled?: number | null;
    lastPrintDate?: string | null;
    printedNum?: number | null;
    displayOrder?: number | null;
    startNum?: number | null;
    printName?: string | null;
    haveEmergency?: number | null;
    isBackup?: number | null;
    roomSubname?: string | null;
    roomGroup?: VnptPhatsoRoomGroup;
    donvi?: VnptDonvi;
    queues?: Array<VnptPhatsoQueue> | null;
    printerRooms?: Array<VnptPhatsoPrinterRoom> | null;
    callers?: Array<VnptPhatsoCaller> | null;
};

