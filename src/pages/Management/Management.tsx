import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { baseService } from '../../services/base/baseService';
import { getAllCallers, getAllRoomGroups, getDonvis, getPrinters, deleteDonvi, deleteCaller, deleteRoom, deletePrinter, deleteRoomGroup, getRoomsWithToken } from '../../services/managementService';
import { mapPrintersToPrinterItems, mapRoomsToRoomItems, mapDonvisToDonviItems } from '../../map';
import type {
  PrinterItem,
  RoomItem,
  RoomGroupItem,
  CallerItem,
  DonviItem
} from './items/managementItem';
import { mapCallersToCallerItems, mapRoomGroupsToRoomGroupItems } from '../../map/managementProfile';
import CallerPopup from './components/CallerPopup';
import RoomPopup from './components/RoomPopup';
import PrinterPopup from './components/PrinterPopup';
import RoomGroupPopup from './components/RoomGroupPopup';
import DonviPopup from './components/DonviPopup';
import ConfirmationPopup from './components/ConfirmationPopup';
import { removeToken } from '../../utils/auth';
import { useAuthCheck } from '../../hooks/useAuthCheck';

const Management = () => {
  const [activeTab, setActiveTab] = useState('donvi');
  const [callerData, setCallerData] = useState<CallerItem[]>([]);
  const [roomData, setRoomData] = useState<RoomItem[]>([]);
  const [printerData, setPrinterData] = useState<PrinterItem[]>([]);
  const [roomGroupData, setRoomGroupData] = useState<RoomGroupItem[]>([]);
  const [donviData, setDonviData] = useState<DonviItem[]>([]);

  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [showCallerPopup, setShowCallerPopup] = useState(false);
  const [showDonviPopup, setShowDonviPopup] = useState(false);
  const [showRoomPopup, setShowRoomPopup] = useState(false);
  const [showPrinterPopup, setShowPrinterPopup] = useState(false);
  const [showRoomGroupPopup, setShowRoomGroupPopup] = useState(false);

  const [callerDataLoading, setCallerDataLoading] = useState(false);
  const [roomDataLoading, setRoomDataLoading] = useState(false);
  const [printerDataLoading, setPrinterDataLoading] = useState(false);
  const [roomGroupDataLoading, setRoomGroupDataLoading] = useState(false);

  const [editCallerData, setEditCallerData] = useState<CallerItem | undefined>();
  const [editRoomData, setEditRoomData] = useState<RoomItem | undefined>();
  const [editPrinterData, setEditPrinterData] = useState<PrinterItem | undefined>();
  const [editRoomGroupData, setEditRoomGroupData] = useState<RoomGroupItem | undefined>();

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteItem, setDeleteItem] = useState<{ type: string; data: any } | null>(null);
  const navigate = useNavigate();

  // Use auth check hook for automatic token expiration handling
  useAuthCheck();

  const ensureDataLoaded = async () => {
    setCallerDataLoading(true);
    const promises = [];
    
    if (donviData.length === 0) {
      promises.push(loadData('donvi'));
    }
    
    if (roomData.length === 0) {
      promises.push(loadData('rooms'));
    }
    
    if (promises.length > 0) {
      await Promise.all(promises);
    }
    setCallerDataLoading(false);
  };

  const handleAddCallerClick = async () => {
    await ensureDataLoaded();
    setShowCallerPopup(true);
  };

  const handleAddRoomClick = async () => {
    setRoomDataLoading(true);
    const promises = [];
    
    if (donviData.length === 0) {
      promises.push(loadData('donvi'));
    }
    
    if (roomGroupData.length === 0) {
      promises.push(loadData('roomGroups'));
    }
    
    if (promises.length > 0) {
      await Promise.all(promises);
    }
    setRoomDataLoading(false);
    setShowRoomPopup(true);
  };

  const handleAddPrinterClick = async () => {
    setPrinterDataLoading(true);
    if (donviData.length === 0) {
      await loadData('donvi');
    }
    setPrinterDataLoading(false);
    setShowPrinterPopup(true);
  };

  const handleAddRoomGroupClick = async () => {
    setRoomGroupDataLoading(true);
    if (donviData.length === 0) {
      await loadData('donvi');
    }
    setRoomGroupDataLoading(false);
    setShowRoomGroupPopup(true);
  };

  const handleAddDonviClick = () => {
    setShowDonviPopup(true);
  };

  const handleEditCaller = (caller: CallerItem) => {
    setEditCallerData(caller);
    setShowCallerPopup(true);
  };

  const handleEditRoom = (room: RoomItem) => {
    setEditRoomData(room);
    setShowRoomPopup(true);
  };

  const handleEditPrinter = (printer: PrinterItem) => {
    setEditPrinterData(printer);
    setShowPrinterPopup(true);
  };

  const handleEditRoomGroup = (roomGroup: RoomGroupItem) => {
    setEditRoomGroupData(roomGroup);
    setShowRoomGroupPopup(true);
  };

  const handleDeleteDonvi = (donvi: DonviItem) => {
    setDeleteItem({ type: 'donvi', data: donvi });
    setShowDeleteConfirmation(true);
  };

  const handleDeleteCaller = (caller: CallerItem) => {
    setDeleteItem({ type: 'caller', data: caller });
    setShowDeleteConfirmation(true);
  };

  const handleDeleteRoom = (room: RoomItem) => {
    setDeleteItem({ type: 'room', data: room });
    setShowDeleteConfirmation(true);
  };

  const handleDeletePrinter = (printer: PrinterItem) => {
    setDeleteItem({ type: 'printer', data: printer });
    setShowDeleteConfirmation(true);
  };

  const handleDeleteRoomGroup = (roomGroup: RoomGroupItem) => {
    setDeleteItem({ type: 'roomGroup', data: roomGroup });
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteItem) return;

    try {
      switch (deleteItem.type) {
        case 'donvi':
          await deleteDonvi(deleteItem.data.id);
          setDonviData(prev => prev.filter(item => item.id !== deleteItem.data.id));
          break;
        case 'caller':
          await deleteCaller(deleteItem.data.id);
          setCallerData(prev => prev.filter(item => item.id !== deleteItem.data.id));
          break;
        case 'room':
          await deleteRoom(deleteItem.data.id);
          setRoomData(prev => prev.filter(item => item.id !== deleteItem.data.id));
          break;
        case 'printer':
          await deletePrinter(deleteItem.data.id);
          setPrinterData(prev => prev.filter(item => item.id !== deleteItem.data.id));
          break;
        case 'roomGroup':
          await deleteRoomGroup(deleteItem.data.id);
          setRoomGroupData(prev => prev.filter(item => item.id !== deleteItem.data.id));
          break;
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      // You could add error handling/notification here
    } finally {
      setShowDeleteConfirmation(false);
      setDeleteItem(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
    setDeleteItem(null);
  };

  const formatDate = (dateString: string | Date) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const renderPagination = (totalItems: number) => {
    const totalPages = Math.ceil(totalItems / pageSize);
    return (
      <div className="flex justify-between items-center p-4 bg-white border-t border-gray-200">
        <div className="flex items-center gap-2">
          <label className="text-sm text-black">Số dòng trên trang:</label>
          <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }} className="px-2 py-1 border border-gray-300 rounded bg-white text-black">
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
          </select>
        </div>
        <div className="flex items-center gap-4">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} className="px-4 py-2 border border-gray-300 bg-white rounded cursor-pointer text-sm text-black transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">Trước</button>
          <span className="text-sm text-black">Trang {currentPage} trên {totalPages}</span>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} className="px-4 py-2 border border-gray-300 bg-white rounded cursor-pointer text-sm text-black transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">Tiếp</button>
        </div>
      </div>
    );
  };

  useEffect(() => {
    loadData(activeTab);
    setCurrentPage(1);
  }, [activeTab]);

  const loadData = async (tab: string) => {
    setLoading(true);
    try {
      switch (tab) {
        case 'donvi':
            const donviResponse = await getDonvis();
            setDonviData(mapDonvisToDonviItems(donviResponse));
          break;
        case 'caller':
          // Load caller data
          const callerResponse = await getAllCallers();
          setCallerData(mapCallersToCallerItems(callerResponse));
          break;
        case 'rooms':
          // Load room data - using default donviId for now
          const roomResponse = await getRoomsWithToken();
          setRoomData(mapRoomsToRoomItems(roomResponse));
          break;
        case 'printers':
          // Load printer data
          const printerResponse = await getPrinters();
          setPrinterData(mapPrintersToPrinterItems(printerResponse));
          break;
        case 'roomGroups':
          // Load room group data
          const roomGroupResponse = await getAllRoomGroups();
          setRoomGroupData(mapRoomGroupsToRoomGroupItems(roomGroupResponse));
          break;
      }
    } catch (error) {
      console.error('Error loading data:', error);
      // Set empty arrays as fallback
      switch (tab) {
        case 'donvi':
          setDonviData([]);
          break;
        case 'caller':
          setCallerData([]);
          break;
        case 'rooms':
          setRoomData([]);
          break;
        case 'printers':
          setPrinterData([]);
          break;
        case 'roomGroups':
          setRoomGroupData([]);
          break;
      }
    } finally {
      setLoading(false);
    }
  };

  const renderDonviTable = () => {
    const currentData = donviData;
    const paginatedData = currentData.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800 m-0">Quản trị Đơn vị</h3>
        <button className="bg-green-400 hover:bg-green-500 text-white px-4 py-2 rounded cursor-pointer text-sm transition-colors" onClick={handleAddDonviClick}>Thêm Đơn vị</button>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="p-4 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">ID</th>
            <th className="p-4 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">Tên Đơn vị</th>
            <th className="p-4 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">Đang hoạt động</th>
            <th className="p-4 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">Tên người dùng</th>
            <th className="p-4 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {
            paginatedData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="p-4 border-b border-gray-200 text-black">{item.id}</td>
                <td className="p-4 border-b border-gray-200 text-black">{item.tenDonvi}</td>
                <td className="p-4 border-b border-gray-200">
                  <input type="checkbox" checked={item.enable} readOnly  />
                </td>
                <td className="p-4 border-b border-gray-200 text-black">{item.username}</td>
                <td className="p-4 border-b border-gray-200">
                  <button className="bg-red-400 hover:bg-red-500 text-white px-2 py-1 rounded text-xs cursor-pointer transition-colors" onClick={() => handleDeleteDonvi(item)}>Xóa</button>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
      {renderPagination(currentData.length)}
      <DonviPopup
        isOpen={showDonviPopup}
        onClose={() => {
          setShowDonviPopup(false);
        }}
        onSuccess={() => {
          loadData('donvi');
        }}
      />
    </div>
    );
  };

  const renderCallerTable = () => {
    const currentData = callerData;
    const paginatedData = currentData.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800 m-0">Quản trị Caller</h3>
        <button className="bg-green-400 hover:bg-green-500 text-white px-4 py-2 rounded cursor-pointer text-sm transition-colors disabled:opacity-50" onClick={handleAddCallerClick} disabled={callerDataLoading}>
          {callerDataLoading ? 'Đang tải...' : 'Thêm Caller mới'}
        </button>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="p-4 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">ID</th>
            <th className="p-4 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">Tên Caller</th>
            <th className="p-4 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">Xác minh mật khẩu</th>
            <th className="p-4 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">Phòng</th>
            <th className="p-4 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">Đơn vị</th>
            <th className="p-4 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="p-4 border-b border-gray-200 text-black">{item.id}</td>
              <td className="p-4 border-b border-gray-200 text-black">{item.callerName}</td>
              <td className="p-4 border-b border-gray-200 text-black">{item.passVerify}</td>
              <td className="p-4 border-b border-gray-200 text-black">{item.roomName}</td>
              <td className="p-4 border-b border-gray-200 text-black">{item.donviName}</td>
              <td className="p-4 border-b border-gray-200">
                <button className="bg-blue-400 hover:bg-blue-500 text-white px-2 py-1 rounded text-xs cursor-pointer transition-colors mr-2" onClick={() => handleEditCaller(item)}>Sửa</button>
                <button className="bg-red-400 hover:bg-red-500 text-white px-2 py-1 rounded text-xs cursor-pointer transition-colors" onClick={() => handleDeleteCaller(item)}>Xoá</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {renderPagination(currentData.length)}
      <CallerPopup
        isOpen={showCallerPopup}
        onClose={() => {
          setShowCallerPopup(false);
          setEditCallerData(undefined);
        }}
        onSuccess={() => {
          loadData('caller');
          setEditCallerData(undefined);
        }}
        donviData={donviData}
        editData={editCallerData}
      />
    </div>
    );
  };

  const renderRoomTable = () => {
    const currentData = roomData;
    const paginatedData = currentData.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800 m-0">Quản trị Phòng</h3>
        <button className="bg-green-400 hover:bg-green-500 text-white px-4 py-2 rounded cursor-pointer text-sm transition-colors disabled:opacity-50" onClick={handleAddRoomClick} disabled={roomDataLoading}>
          {roomDataLoading ? 'Đang tải...' : 'Thêm Phòng mới'}
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="p-4 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">ID</th>
              <th className="p-4 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">Đơn vị</th>
              <th className="p-4 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">Tên Phòng</th>
              <th className="p-4 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">Đã kích hoạt</th>
              <th className="p-4 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">Ngày in cuối</th>
              <th className="p-4 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">Số lần in</th>
              <th className="p-4 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">Thứ tự hiển thị</th>
              <th className="p-4 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">Số bắt đầu</th>
              <th className="p-4 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">Tên in</th>
              <th className="p-4 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">Khẩn cấp</th>
              <th className="p-4 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">Bản sao lưu</th>
              <th className="p-4 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="p-4 border-b border-gray-200 text-black">{item.id}</td>
                <td className="p-4 border-b border-gray-200 text-black">{item.donviName}</td>
                <td className="p-4 border-b border-gray-200 text-black">{item.roomName}</td>
                <td className="p-4 border-b border-gray-200">
                  <input type="checkbox" checked={item.enabled} readOnly />
                </td>
                <td className="p-4 border-b border-gray-200 text-black">{formatDate(item.lastPrintDate)}</td>
                <td className="p-4 border-b border-gray-200 text-black">{item.printedNum}</td>
                <td className="p-4 border-b border-gray-200 text-black">{item.displayOrder}</td>
                <td className="p-4 border-b border-gray-200 text-black">{item.startNum}</td>
                <td className="p-4 border-b border-gray-200 text-black">{item.printName}</td>
                <td className="p-4 border-b border-gray-200">
                  <input type="checkbox" checked={item.haveEmergency} readOnly />
                </td>
                <td className="p-4 border-b border-gray-200">
                  <input type="checkbox" checked={item.isBackup} readOnly />
                </td>
                <td className="p-4 border-b border-gray-200">
                  <button className="bg-blue-400 hover:bg-blue-500 text-white px-2 py-1 rounded text-xs cursor-pointer transition-colors mr-2" onClick={() => handleEditRoom(item)}>Sửa</button>
                  <button className="bg-red-400 hover:bg-red-500 text-white px-2 py-1 rounded text-xs cursor-pointer transition-colors" onClick={() => handleDeleteRoom(item)}>Xoá</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {renderPagination(currentData.length)}
      <RoomPopup
        isOpen={showRoomPopup}
        onClose={() => {
          setShowRoomPopup(false);
          setEditRoomData(undefined);
        }}
        onSuccess={() => {
          loadData('rooms');
          setEditRoomData(undefined);
        }}
        donviData={donviData}
        editData={editRoomData}
      />
    </div>
    );
  };

  const renderPrinterTable = () => {
    const currentData = printerData;
    const paginatedData = currentData.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800 m-0">Quản trị Máy in</h3>
        <button className="bg-green-400 hover:bg-green-500 text-white px-4 py-2 rounded cursor-pointer text-sm transition-colors disabled:opacity-50" onClick={handleAddPrinterClick} disabled={printerDataLoading}>
          {printerDataLoading ? 'Đang tải...' : 'Thêm Máy in mới'}
        </button>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="p-4 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">ID</th>
            <th className="p-4 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">Tên</th>
            <th className="p-4 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">Đã kích hoạt</th>
            <th className="p-4 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">Xác minh mật khẩu</th>
            <th className="p-4 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">Đơn vị</th>
            <th className="p-4 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="p-4 border-b border-gray-200 text-black">{item.id}</td>
              <td className="p-4 border-b border-gray-200 text-black">{item.name}</td>
              <td className="p-4 border-b border-gray-200">
                <input type="checkbox" checked={item.enable} readOnly />
              </td>
              <td className="p-4 border-b border-gray-200 text-black">{item.passVerify}</td>
              <td className="p-4 border-b border-gray-200 text-black">{item.donviName}</td>
              <td className="p-4 border-b border-gray-200">
                <button className="bg-blue-400 hover:bg-blue-500 text-white px-2 py-1 rounded text-xs cursor-pointer transition-colors mr-2" onClick={() => handleEditPrinter(item)}>Sửa</button>
                <button className="bg-red-400 hover:bg-red-500 text-white px-2 py-1 rounded text-xs cursor-pointer transition-colors" onClick={() => handleDeletePrinter(item)}>Xoá</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {renderPagination(currentData.length)}
      <PrinterPopup
        isOpen={showPrinterPopup}
        onClose={() => {
          setShowPrinterPopup(false);
          setEditPrinterData(undefined);
        }}
        onSuccess={() => {
          loadData('printers');
          setEditPrinterData(undefined);
        }}
        donviData={donviData}
        editData={editPrinterData}
      />
    </div>
    );
  };

  const renderRoomGroupTable = () => {
    const currentData = roomGroupData;
    const paginatedData = currentData.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800 m-0">Quản trị Nhóm Phòng</h3>
        <button className="bg-green-400 hover:bg-green-500 text-white px-4 py-2 rounded cursor-pointer text-sm transition-colors disabled:opacity-50" onClick={handleAddRoomGroupClick} disabled={roomGroupDataLoading}>
          {roomGroupDataLoading ? 'Đang tải...' : 'Thêm Nhóm mới'}
        </button>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="p-4 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">ID</th>
            <th className="p-4 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">Tên Nhóm</th>
            <th className="p-4 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">Số lượng tối thiểu</th>
            <th className="p-4 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">Số lượng tối đa</th>
            <th className="p-4 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">Đơn vị</th>
            <th className="p-4 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="p-4 border-b border-gray-200 text-black">{item.id}</td>
              <td className="p-4 border-b border-gray-200 text-black">{item.groupName}</td>
              <td className="p-4 border-b border-gray-200 text-black">{item.minNum}</td>
              <td className="p-4 border-b border-gray-200 text-black">{item.maxNum}</td>
              <td className="p-4 border-b border-gray-200 text-black">{item.donviName}</td>
              <td className="p-4 border-b border-gray-200">
                <button className="bg-blue-400 hover:bg-blue-500 text-white px-2 py-1 rounded text-xs cursor-pointer transition-colors mr-2" onClick={() => handleEditRoomGroup(item)}>Sửa</button>
                <button className="bg-red-400 hover:bg-red-500 text-white px-2 py-1 rounded text-xs cursor-pointer transition-colors" onClick={() => handleDeleteRoomGroup(item)}>Xoá</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {renderPagination(currentData.length)}
      <RoomGroupPopup
        isOpen={showRoomGroupPopup}
        onClose={() => {
          setShowRoomGroupPopup(false);
          setEditRoomGroupData(undefined);
        }}
        onSuccess={() => {
          loadData('roomGroups');
          setEditRoomGroupData(undefined);
        }}
        donviData={donviData}
        editData={editRoomGroupData}
      />
    </div>
    );
  };

  const handleLogout = () => {
    // Clear token using auth utility
    removeToken();
    // Clear token from baseService
    baseService.setToken(null);
    // Navigate back to login
    navigate('/');
  };

  const renderContent = () => {
    if (loading) {
      return <div className="loading">Đang tải dữ liệu...</div>;
    }

    switch (activeTab) {
        case 'donvi':
            return renderDonviTable();
      case 'caller':
        return renderCallerTable();
      case 'rooms':
        return renderRoomTable();
      case 'printers':
        return renderPrinterTable();
      case 'roomGroups':
        return renderRoomGroupTable();
      default:
        return renderDonviTable();
    }
  };

  return (
    
    <div className="h-screen w-screen bg-gray-100 fixed top-0 left-0 m-0 p-0 overflow-y-auto">
      <header className="bg-white p-4 md:px-8 shadow-md flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 m-0">Bảng Quản lý</h1>
        <div className="flex items-center gap-4">
          <button className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded cursor-pointer text-sm transition-colors" onClick={handleLogout}>Đăng xuất</button>
        </div>
      </header>

      <nav className="bg-white px-4 md:px-8 border-b border-gray-200 flex flex-wrap gap-0">
        <button
          className={`px-4 md:px-6 py-4 border-b-4 transition-all text-gray-600 hover:bg-gray-50 hover:text-gray-800 ${activeTab === 'donvi' ? 'border-blue-500 text-blue-600 font-medium' : 'border-transparent'}`}
          onClick={() => setActiveTab('donvi')}
        >
          Quản lý Đơn vị
        </button>
        <button
          className={`px-4 md:px-6 py-4 border-b-4 transition-all text-gray-600 hover:bg-gray-50 hover:text-gray-800 ${activeTab === 'caller' ? 'border-blue-500 text-blue-600 font-medium' : 'border-transparent'}`}
          onClick={() => setActiveTab('caller')}
        >
          Quản lý Caller
        </button>
        <button
          className={`px-4 md:px-6 py-4 border-b-4 transition-all text-gray-600 hover:bg-gray-50 hover:text-gray-800 ${activeTab === 'rooms' ? 'border-blue-500 text-blue-600 font-medium' : 'border-transparent'}`}
          onClick={() => setActiveTab('rooms')}
        >
          Quản lý Phòng
        </button>
        <button
          className={`px-4 md:px-6 py-4 border-b-4 transition-all text-gray-600 hover:bg-gray-50 hover:text-gray-800 ${activeTab === 'printers' ? 'border-blue-500 text-blue-600 font-medium' : 'border-transparent'}`}
          onClick={() => setActiveTab('printers')}
        >
          Quản lý Máy in
        </button>
        <button
          className={`px-4 md:px-6 py-4 border-b-4 transition-all text-gray-600 hover:bg-gray-50 hover:text-gray-800 ${activeTab === 'roomGroups' ? 'border-blue-500 text-blue-600 font-medium' : 'border-transparent'}`}
          onClick={() => setActiveTab('roomGroups')}
        >
          Quản lý Nhóm Phòng
        </button>
        <button
          className="bg-green-400 hover:bg-green-500 mb-3 text-white px-4 md:px-6 py-4 rounded cursor-pointer text-sm transition-colors ml-auto"
          onClick={() => navigate('/statistics')}
        >
          Thống kê
        </button>
      </nav>

      <main className="p-4 md:p-8">
        {renderContent()}
      </main>

      <ConfirmationPopup
        isOpen={showDeleteConfirmation}
        message="Xác nhận xoá dữ liệu"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default Management;