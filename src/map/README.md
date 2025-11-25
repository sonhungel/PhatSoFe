// Type Mapping System for PhatSoFe
//
// This folder contains the type mapping utilities using @automapper/core
// to transform between API response types and UI component types.
//
// Usage:
//
// 1. Import the mapping functions:
//    import { mapPrintersToPrinterItems, mapRoomsToRoomItems } from '../map';
//
// 2. Use in your components:
//    const printers = await getPrinters();
//    const printerItems = mapPrintersToPrinterItems(printers);
//    setPrinterData(printerItems);
//
// 3. For single item mapping:
//    const printerItem = mapPrinterToPrinterItem(printer);
//
// Available Mappings:
// - Printer (API) ↔ PrinterItem (UI)
// - Room (API) ↔ RoomItem (UI)
// - RoomGroup (API) ↔ RoomGroupItem (UI)
//
// The mapping system handles:
// - Null/undefined value handling
// - Type conversions (e.g., number to boolean for enabled fields)
// - Default values for missing API fields
// - Consistent data structure for UI components