import { baseService } from "./base/baseService";
import type { VnptPhatsoQueueLog } from "../openAPIGenerate";

export interface QueueLogStatistics {
  weekLabel: string;
  totalCount: number;
  startDate: string;
  endDate: string;
  details: VnptPhatsoQueueLog[];
}

export interface WeeklyStatisticsRequest {
   donviId: number;
   startDate: string;
   endDate: string;
}

export interface VnptPhatSoStatiticsWeeklyByRoom {
    roomId : number;
    donviId : number;
    roomName : string;
    weekCount : number;
}

export async function GetQueueLogsByDateRange(payload: WeeklyStatisticsRequest): Promise<VnptPhatSoStatiticsWeeklyByRoom[]> {
  const { data } = await baseService.http.post<VnptPhatSoStatiticsWeeklyByRoom[]>('Queue/Statistics/weekly', payload );
  return data;
}
