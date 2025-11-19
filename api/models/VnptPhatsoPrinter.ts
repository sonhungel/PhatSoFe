/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { VnptDonvi } from './VnptDonvi';
import type { VnptPhatsoPrinterRoom } from './VnptPhatsoPrinterRoom';
export type VnptPhatsoPrinter = {
    id?: number;
    donviId?: number | null;
    name?: string | null;
    enable?: number | null;
    passVerify?: string | null;
    donvi?: VnptDonvi;
    printerRooms?: Array<VnptPhatsoPrinterRoom> | null;
};

