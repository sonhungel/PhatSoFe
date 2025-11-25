import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { baseService } from '../../services/base/baseService';
import './Management.css';
import { getAllCallers, getAllRoomGroups, getAllRooms, getDonvis, getPrinters, deleteDonvi, deleteCaller, deleteRoom, deletePrinter, deleteRoomGroup } from '../../services/managementService';
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
      <div className="pagination">
        <div className="page-size-selector">
          <label>Rows per page:</label>
          <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
          </select>
        </div>
        <div className="page-controls">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
          <span>Page {currentPage} of {totalPages}</span>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
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
          const roomResponse = await getAllRooms();
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
    <div className="table-container">
      <div className="table-header">
        <h3>Donvi Management</h3>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Ten Don vi</th>
            <th>Is Active</th>
            <th>Username</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {
            paginatedData.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.tenDonvi}</td>
                <td>
                  <input type="checkbox" checked={item.enable} readOnly className="light-checkbox" />
                </td>
                <td>{item.username}</td>
                <td>
                  <button className="delete-btn" onClick={() => handleDeleteDonvi(item)}>Delete</button>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
      {renderPagination(currentData.length)}
    </div>
    );
  };

  const renderCallerTable = () => {
    const currentData = callerData;
    const paginatedData = currentData.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    return (
    <div className="table-container">
      <div className="table-header">
        <h3>Caller Management</h3>
        <button className="add-btn" onClick={handleAddCallerClick} disabled={callerDataLoading}>
          {callerDataLoading ? 'Loading...' : 'Add New Caller'}
        </button>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Caller Name</th>
            <th>Pass Verify</th>
            <th>Room ID</th>
            <th>Donvi ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.callerName}</td>
              <td>{item.passVerify}</td>
              <td>{item.roomId}</td>
              <td>{item.donviId}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEditCaller(item)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDeleteCaller(item)}>Delete</button>
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
    <div className="table-container">
      <div className="table-header">
        <h3>Room Management</h3>
        <button className="add-btn" onClick={handleAddRoomClick} disabled={roomDataLoading}>
          {roomDataLoading ? 'Loading...' : 'Add New Room'}
        </button>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Don vi Id</th>
            <th>Room Name</th>
            <th>Room Group Id</th>
            <th>Enabled</th>
            <th>LastPrintDate</th>
            <th>Printed Num</th>
            <th>DisplayOrder</th>
            <th>StartNum</th>
            <th>PrintName</th>
            <th>HaveEmergency</th>
            <th>IsBackup</th>
            <th>RoomSubname</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.donviId}</td>
              <td>{item.roomName}</td>
              <td>{item.roomGroupId}</td>
              <td>
                <input type="checkbox" checked={item.enabled} readOnly className="light-checkbox" />
              </td>
              <td>{formatDate(item.lastPrintDate)}</td>
              <td>{item.printedNum}</td>
              <td>{item.displayOrder}</td>
              <td>{item.startNum}</td>
              <td>{item.printName}</td>
              <td>
                <input type="checkbox" checked={item.haveEmergency} readOnly className="light-checkbox" />
              </td>
              <td>
                <input type="checkbox" checked={item.isBackup} readOnly className="light-checkbox" />
              </td>
              <td>{item.roomSubname}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEditRoom(item)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDeleteRoom(item)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
    <div className="table-container">
      <div className="table-header">
        <h3>Printer Management</h3>
        <button className="add-btn" onClick={handleAddPrinterClick} disabled={printerDataLoading}>
          {printerDataLoading ? 'Loading...' : 'Add New Printer'}
        </button>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Enable</th>
            <th>Pass Verify</th>
            <th>Donvi ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>
                <input type="checkbox" checked={item.enable} readOnly className="light-checkbox" />
              </td>
              <td>{item.passVerify}</td>
              <td>{item.donviId}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEditPrinter(item)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDeletePrinter(item)}>Delete</button>
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
    <div className="table-container">
      <div className="table-header">
        <h3>Room Group Management</h3>
        <button className="add-btn" onClick={handleAddRoomGroupClick} disabled={roomGroupDataLoading}>
          {roomGroupDataLoading ? 'Loading...' : 'Add New Group'}
        </button>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Group Name</th>
            <th>Min Num</th>
            <th>Max Num</th>
            <th>Donvi ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.groupName}</td>
              <td>{item.minNum}</td>
              <td>{item.maxNum}</td>
              <td>{item.donviId}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEditRoomGroup(item)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDeleteRoomGroup(item)}>Delete</button>
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
      return <div className="loading">Loading data...</div>;
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
    
    <div className="management-container">
      <header className="management-header">
        <h1>Management Dashboard</h1>
        <div className="user-info">
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <nav className="management-nav">
        <button
          className={`nav-tab ${activeTab === 'donvi' ? 'active' : ''}`}
          onClick={() => setActiveTab('donvi')}
        >
          Donvi Management
        </button>
        <button
          className={`nav-tab ${activeTab === 'caller' ? 'active' : ''}`}
          onClick={() => setActiveTab('caller')}
        >
          Caller Management
        </button>
        <button
          className={`nav-tab ${activeTab === 'rooms' ? 'active' : ''}`}
          onClick={() => setActiveTab('rooms')}
        >
          Room Management
        </button>
        <button
          className={`nav-tab ${activeTab === 'printers' ? 'active' : ''}`}
          onClick={() => setActiveTab('printers')}
        >
          Printer Management
        </button>
        <button
          className={`nav-tab ${activeTab === 'roomGroups' ? 'active' : ''}`}
          onClick={() => setActiveTab('roomGroups')}
        >
          Room Groups
        </button>
      </nav>

      <main className="management-content">
        {renderContent()}
      </main>

      <ConfirmationPopup
        isOpen={showDeleteConfirmation}
        message="Verify delete data"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default Management;