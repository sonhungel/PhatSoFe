/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { VnptPhatsoCaller } from './VnptPhatsoCaller';
import type { VnptPhatsoPrinter } from './VnptPhatsoPrinter';
import type { VnptPhatsoQueueLog } from './VnptPhatsoQueueLog';
import type { VnptPhatsoRoom } from './VnptPhatsoRoom';
import type { VnptPhatsoRoomGroup } from './VnptPhatsoRoomGroup';
export type VnptDonvi = {
    id?: number;
    tenDonvi?: string | null;
    enable?: boolean | null;
    username?: string | null;
    password?: string | null;
    rooms?: Array<VnptPhatsoRoom> | null;
    printers?: Array<VnptPhatsoPrinter> | null;
    callers?: Array<VnptPhatsoCaller> | null;
    vnptPhatsoQueueLogs?: Array<VnptPhatsoQueueLog> | null;
    vnptPhatsoRoomGroups?: Array<VnptPhatsoRoomGroup> | null;
};

