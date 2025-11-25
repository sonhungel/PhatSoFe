import type {
    VnptDonvi,
  VnptPhatsoPrinter,
  VnptPhatsoRoom,
  VnptPhatsoRoomGroup,
  VnptPhatsoCaller
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
export function mapPrinterToPrinterItem(printer: VnptPhatsoPrinter): PrinterItem {
  return {
    id: printer.id || 0,
    donviId: printer.donviId || 0,
    name: printer.name || '',
    enable: Boolean(printer.enable),
    passVerify: printer.passVerify || ''
  };
}

export function mapPrintersToPrinterItems(printers: VnptPhatsoPrinter[]): PrinterItem[] {
  return printers.map(mapPrinterToPrinterItem);
}

export function mapCallerToCallerItem(caller: VnptPhatsoCaller): CallerItem {
  return {
    id: caller.id || 0,
    donviId: caller.donviId || 0,
    callerName: caller.callerName || '',
    passVerify: caller.passVerify || '',
    roomId: caller.roomId || 0
  };
}

export function mapCallersToCallerItems(callers: VnptPhatsoCaller[]): CallerItem[] {
  return callers.map(mapCallerToCallerItem);
}

export function mapRoomToRoomItem(room: VnptPhatsoRoom): RoomItem {
  return {
    id: room.id || 0,
    donviId: room.donviId || 0,
    roomName: room.roomName || '',
    roomGroupId: room.roomGroupId || 0,
    enabled: Boolean(room.enabled === 1),
    lastPrintDate: room.lastPrintDate || '',
    printedNum: room.printedNum || 0,
    displayOrder: room.displayOrder || 0,
    startNum: room.startNum || 0,
    printName: room.printName || '',
    haveEmergency: Boolean(room.haveEmergency),
    isBackup: Boolean(room.isBackup),
    roomSubname: room.roomSubname || ''
  };
}

export function mapRoomsToRoomItems(rooms: VnptPhatsoRoom[]): RoomItem[] {
  return rooms.map(mapRoomToRoomItem);
}

export function mapRoomGroupToRoomGroupItem(roomGroup: VnptPhatsoRoomGroup): RoomGroupItem {
  return {
    id: roomGroup.id || 0,
    groupName: roomGroup.groupName || '',
    minNum: roomGroup.minNum || 0,
    maxNum: roomGroup.maxNum || 0,
    donviId: roomGroup.donviId || 0
  };
}

export function mapRoomGroupsToRoomGroupItems(roomGroups: VnptPhatsoRoomGroup[]): RoomGroupItem[] {
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