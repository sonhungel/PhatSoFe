export interface CallerItem {
  id: number;
  donviId: number;
  callerName: string;
  passVerify: string;
  roomId: number;
}

export interface RoomItem {
  id: number;
  donviId: number;
  roomName: string;
  roomGroupId: number;
  enabled: boolean;
  lastPrintDate: Date | string;
  printedNum: number;
  displayOrder: number;
  startNum: number;
  printName: string;
  haveEmergency: boolean;
  isBackup: boolean;
  roomSubname: string;
}

export interface PrinterItem {
  id: number;
  donviId: number;
  name: string;
  enable: boolean;
  passVerify: string;
}


export interface RoomGroupItem {
  id: number;
  groupName: string;
  minNum: number;
  maxNum: number;
  donviId: number;
}

export interface DonviItem {
  id: number;
  tenDonvi: string;
  enable: boolean;
  username: string;
  password: string;
}