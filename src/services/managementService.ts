import { baseService } from "./base/baseService";
import type { VnptDonvi, VnptPhatsoCaller, VnptPhatsoCallerResponseModel, VnptPhatsoPrinterResponseModel, VnptPhatsoRoom, VnptPhatsoRoomGroup, VnptPhatSoRoomGroupResponseModel, VnptPhatSoRoomResponseModel } from "../openAPIGenerate";
import type { VnptPhatsoPrinter } from "../openAPIGenerate";

// Types for API requests and responses

export interface CreateDonviRequest {
  tenDonvi: string;
  enable: boolean;
  username: string;
  password: string;
}

export interface CreatePrinterRequest {
  name: string;
  donviId: number;
  enable?: boolean;
  passVerify?: string;
}

export interface UpdatePrinterRequest {
  id?: number;
  donviId?: number;
  name?: string;
  enable: boolean;
  passVerify?: string;
}

export interface VerifyPrinterRequest {
  verificationCode: string;
}


export interface CreateRoomRequest {
  roomName: string;
  donviId: number;
  roomGroupId?: number;
  enabled?: boolean;
  lastPrintDate?: Date;
  printedNum?: number;
  displayOrder?: number;
  startNum?: number;
  printName?: string;
  haveEmergency?: boolean;
  isBackup?: boolean;
  roomSubname?: string;
}

export interface UpdateRoomRequest {
    id?: number;
    donviId?: number;
    roomName?: string;
    roomGroupId?: number;
    enabled: boolean;
    lastPrintDate?: Date;
    printedNum?: number;
    displayOrder?: number;
    startNum?: number;
    printName?: string;
    haveEmergency?: boolean;
    isBackup?: boolean;
    roomSubname?: string;
}

export interface CreateCallerRequest {
  callerName: string;
  passVerify: string;
  donviId: number;
  roomId: number;
}

export interface UpdateCallerRequest {
    id?: number;
    donviId?: number;
    callerName?: string;
    passVerify?: string;
    roomId?: number;
}

export interface VerifyCallerRequest {
  verificationCode: string;
}

export interface CreateRoomGroupRequest {
  groupName: string;
  minNum?: number;
  maxNum?: number;
  donviId: number;
}

export interface UpdateRoomGroupRequest {
  id?: number;
  groupName: string;
  minNum?: number;
  maxNum?: number;
  donviId: number;
}

export interface ApiResponse<T> {
  data?: T;
  isSuccess: boolean;
  message: string;
}

// Donvi (Units) functions
export async function getDonvis(): Promise<VnptDonvi[]> {
  const { data } = await baseService.http.get<VnptDonvi[]>('/Management/donvis');
  return data;
}

export async function createDonvi(payload: CreateDonviRequest): Promise<VnptDonvi> {
  const { data } = await baseService.http.post<VnptDonvi>('/Management/donvis', payload);
  return data;
}

export async function deleteDonvi(id: number): Promise<void> {
  await baseService.http.delete(`/Management/donvis/${id}`);
}

// Printer functions
export async function getPrinters(): Promise<VnptPhatsoPrinterResponseModel[]> {
  const { data } = await baseService.http.get<VnptPhatsoPrinterResponseModel[]>('/Management/allPrinters');
  return data;
}

export async function createPrinter(payload: CreatePrinterRequest): Promise<VnptPhatsoPrinter> {
  const { data } = await baseService.http.post<VnptPhatsoPrinter>('/Management/printers', payload);
  return data;
}

export async function updatePrinter(id: number, payload: UpdatePrinterRequest): Promise<void> {
  await baseService.http.put(`/Management/printers/${id}`, payload);
}

export async function deletePrinter(id: number): Promise<void> {
  await baseService.http.delete(`/Management/printers/${id}`);
}

export async function verifyPrinter(printerId: number, payload: VerifyPrinterRequest): Promise<void> {
  await baseService.http.post(`/Management/printers/${printerId}/verify`, payload);
}

// Room functions
export async function getRoomsByDonvi(donviId: number): Promise<VnptPhatsoRoom[]> {
  const { data } = await baseService.http.get<VnptPhatsoRoom[]>(`/Management/rooms/donvi/${donviId}`);
  return data;
}
export async function GetRoomsByDonviWithoutValidateToken(donviId: number): Promise<VnptPhatsoRoom[]> {
  const { data } = await baseService.http.get<VnptPhatsoRoom[]>(`/Management/roomsnotoken/donvi/${donviId}`);
  return data;
}

export async function getRoomsWithToken(): Promise<VnptPhatSoRoomResponseModel[]> {
  const { data } = await baseService.http.get<VnptPhatSoRoomResponseModel[]>(`/Management/roomsWithToken`);
  return data;
}

export async function createRoom(payload: CreateRoomRequest): Promise<VnptPhatsoRoom> {
  const { data } = await baseService.http.post<VnptPhatsoRoom>('/Management/rooms', payload);
  return data;
}

export async function updateRoom(id: number, payload: UpdateRoomRequest): Promise<void> {
  await baseService.http.put(`/Management/rooms/${id}`, payload);
}

export async function deleteRoom(id: number): Promise<void> {
  await baseService.http.delete(`/Management/rooms/${id}`);
}

// Caller functions
export async function getCallersByDonvi(donviId: number): Promise<VnptPhatsoCaller[]> {
  const { data } = await baseService.http.get<VnptPhatsoCaller[]>(`/Management/callers/donvi/${donviId}`);
  return data;
}

export async function getAllCallers(): Promise<VnptPhatsoCallerResponseModel[]> {
  const { data } = await baseService.http.get<VnptPhatsoCallerResponseModel[]>(`/Management/callers`);
  return data;
}

export async function createCaller(payload: CreateCallerRequest): Promise<VnptPhatsoCaller> {
  const { data } = await baseService.http.post<VnptPhatsoCaller>('/Management/callers', payload);
  return data;
}

export async function updateCaller(payload: UpdateCallerRequest): Promise<void> {
  await baseService.http.put(`/Management/callers/${payload.id}`, payload);
}

export async function deleteCaller(id: number): Promise<void> {
  await baseService.http.delete(`/Management/callers/${id}`);
}

export async function verifyCaller(callerId: number, payload: VerifyCallerRequest): Promise<void> {
  await baseService.http.post(`/Management/callers/${callerId}/verify`, payload);
}

// Room Group functions
export async function getRoomGroup(id: number): Promise<VnptPhatsoRoomGroup> {
  const { data } = await baseService.http.get<VnptPhatsoRoomGroup>(`/Management/room-groups/${id}`);
  return data;
}

export async function getAllRoomGroups(): Promise<VnptPhatSoRoomGroupResponseModel[]> {
  const { data } = await baseService.http.get<VnptPhatSoRoomGroupResponseModel[]>(`/Management/room-groups`);
  return data;
}
export async function getAllRoomGroupsByDonvi(id: number): Promise<VnptPhatsoRoomGroup[]> {
  const { data } = await baseService.http.get<VnptPhatsoRoomGroup[]>(`/Management/room-groups/donvi/${id}`);
  return data;
}

export async function createRoomGroup(payload: CreateRoomGroupRequest): Promise<VnptPhatsoRoomGroup> {
  const { data } = await baseService.http.post<VnptPhatsoRoomGroup>('/Management/room-groups', payload);
  return data;
}

export async function updateRoomGroup(id: number, payload: UpdateRoomGroupRequest): Promise<void> {
  await baseService.http.put(`/Management/room-groups/${id}`, payload);
}

export async function deleteRoomGroup(id: number): Promise<void> {
  await baseService.http.delete(`/Management/room-groups/${id}`);
}
