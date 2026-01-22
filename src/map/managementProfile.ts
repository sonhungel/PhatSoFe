import type {
    VnptDonvi,
  VnptPhatsoPrinterResponseModel,
  VnptPhatsoRoom,
  VnptPhatsoCallerResponseModel,
  VnptPhatSoRoomGroupResponseModel,
  VnptPhatSoRoomResponseModel
} from '../openAPIGenerate';

import type {
  PrinterItem,
  RoomItem,
  RoomGroupItem,
  CallerItem,
  DonviItem
} from '../pages/Management/items/managementItem';

// Define UI component types (these should match what's used in components)


// Simple mapping functions
export function mapPrinterToPrinterItem(printer: VnptPhatsoPrinterResponseModel): PrinterItem {
  return {
    id: printer.id || 0,
    donviId: printer.donviId || 0,
    name: printer.name || '',
    enable: printer.enable || false,
    passVerify: printer.passVerify || '',
    donviName: printer.donviName || ''
  };
}

export function mapPrintersToPrinterItems(printers: VnptPhatsoPrinterResponseModel[]): PrinterItem[] {
  return printers.map(mapPrinterToPrinterItem);
}

export function mapCallerToCallerItem(caller: VnptPhatsoCallerResponseModel): CallerItem {
  return {
    id: caller.id || 0,
    donviId: caller.donviId || 0,
    callerName: caller.callerName || '',
    passVerify: caller.passVerify || '',
    roomId: caller.roomId || 0,
    roomName: caller.roomName || '',
    donviName: caller.donviName || ''
  };
}

export function mapCallersToCallerItems(callers: VnptPhatsoCallerResponseModel[]): CallerItem[] {
  return callers.map(mapCallerToCallerItem);
}

export function mapRoomToRoomItem(room: VnptPhatSoRoomResponseModel): RoomItem {
  return {
    id: room.id || 0,
    donviId: room.donviId || 0,
    roomName: room.roomName || '',
    roomGroupId: room.roomGroupId || 0,
    enabled: room.enabled || false,
    lastPrintDate: room.lastPrintDate || '',
    printedNum: room.printedNum || 0,
    displayOrder: room.displayOrder || 0,
    startNum: room.startNum || 0,
    printName: room.printName || '',
    haveEmergency: room.haveEmergency || false,
    isBackup: room.isBackup || false,
    roomSubname: room.roomSubname || '',
    roomGroupName: room.roomGroupName || '',
    donviName : room.donviName || ''
  };
}

export function mapRoomsToRoomItems(rooms: VnptPhatsoRoom[]): RoomItem[] {
  return rooms.map(mapRoomToRoomItem);
}

export function mapRoomGroupToRoomGroupItem(roomGroup: VnptPhatSoRoomGroupResponseModel): RoomGroupItem {
  return {
    id: roomGroup.id || 0,
    groupName: roomGroup.groupName || '',
    minNum: roomGroup.minNum || 0,
    maxNum: roomGroup.maxNum || 0,
    donviId: roomGroup.donviId || 0,
    donviName: roomGroup.donviName || ''
  };
}

export function mapRoomGroupsToRoomGroupItems(roomGroups: VnptPhatSoRoomGroupResponseModel[]): RoomGroupItem[] {
  return roomGroups.map(mapRoomGroupToRoomGroupItem);
}

// Donvi mappings
export function mapDonviToDonviItem(donvi: VnptDonvi): DonviItem {
  return {
    id: donvi.id || 0,
    tenDonvi: donvi.tenDonvi || '',
    enable: donvi.enable || false,
    username: donvi.username || '',
    password: donvi.password || ''
  };
}

export function mapDonvisToDonviItems(donvis: VnptDonvi[]): DonviItem[] {
  return donvis.map(mapDonviToDonviItem);
}

// Initialize mappings (placeholder for future automapper integration)
export function createManagementMappings() {
  // For now, this is just a placeholder
  // In the future, we can integrate with @automapper/core if needed
  console.log('Management mappings initialized');
}