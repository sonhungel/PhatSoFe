/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { VnptPhatsoPrinter } from './VnptPhatsoPrinter';
import type { VnptPhatsoRoom } from './VnptPhatsoRoom';
export type VnptPhatsoPrinterRoom = {
    printerId?: number;
    roomId?: number;
    donviId?: number | null;
    displayOrder?: number | null;
    printer?: VnptPhatsoPrinter;
    room?: VnptPhatsoRoom;
};

