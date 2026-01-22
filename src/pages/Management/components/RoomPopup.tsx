import { useState, useEffect } from 'react';
import type { DonviItem, RoomGroupItem, RoomItem } from '../items/managementItem';
import { createRoom, getAllRoomGroupsByDonvi, updateRoom } from '../../../services/managementService';
import { mapRoomGroupsToRoomGroupItems } from '../../../map';

interface RoomPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  donviData: DonviItem[];
  editData?: RoomItem;
}

const RoomPopup = ({ isOpen, onClose, onSuccess, donviData, editData }: RoomPopupProps) => {
  const [formData, setFormData] = useState({
    roomName: '',
    donviId: '',
    roomGroupId: '',
    enabled: true,
    printedNum: 0,
    lastPrintDate: '',
    displayOrder: 0,
    startNum: 0,
    printName: '',
    haveEmergency: false,
    isBackup: false,
    roomSubname: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [roomGroupData, setRoomGroupData] = useState<RoomGroupItem[]>([]);

  useEffect(() => {
      if(formData.donviId !== '')
      {
          getAllRoomGroupsByDonvi(parseInt(formData.donviId)).then((roomData) => {
            setRoomGroupData(mapRoomGroupsToRoomGroupItems(roomData));
          });
      }
    },[formData.donviId])

  const isEditMode = !!editData;

  useEffect(() => {
    if (editData) {
      setFormData({
        roomName: editData.roomName,
        donviId: editData.donviId.toString(),
        roomGroupId: editData.roomGroupId.toString(),
        enabled: editData.enabled,
        lastPrintDate: typeof editData.lastPrintDate === 'string' ? editData.lastPrintDate : editData.lastPrintDate.toISOString(),
        printedNum: editData.printedNum,
        displayOrder: editData.displayOrder,
        startNum: editData.startNum,
        printName: editData.printName,
        haveEmergency: editData.haveEmergency,
        isBackup: editData.isBackup,
        roomSubname: editData.roomSubname
      });
    } else {
      setFormData({
        roomName: '',
        donviId: '',
        roomGroupId: '',
        enabled: true,
        lastPrintDate: '',
        printedNum: 0,
        displayOrder: 0,
        startNum: 0,
        printName: '',
        haveEmergency: false,
        isBackup: false,
        roomSubname: ''
      });
    }
    setError('');
  }, [editData, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.roomName.trim()) {
      setError('Room name is required');
      return;
    }
    if (!formData.donviId) {
      setError('Please select a Donvi');
      return;
    }

    setLoading(true);
    try {
      if (isEditMode && editData) {
        await updateRoom(editData.id, {
          id: editData.id,
          roomName: formData.roomName.trim(),
          donviId: parseInt(formData.donviId),
          roomGroupId: formData.roomGroupId ? parseInt(formData.roomGroupId) : undefined,
          enabled: formData.enabled,
          printedNum: formData.printedNum,
          displayOrder: formData.displayOrder,
          startNum: formData.startNum,
          printName: formData.printName.trim() || undefined,
          haveEmergency: formData.haveEmergency,
          isBackup: formData.isBackup,
          roomSubname: formData.roomSubname.trim() || undefined,
          lastPrintDate: formData.lastPrintDate ? new Date(formData.lastPrintDate) : undefined
        });
      } else {
        await createRoom({
          roomName: formData.roomName.trim(),
          donviId: parseInt(formData.donviId),
          roomGroupId: formData.roomGroupId ? parseInt(formData.roomGroupId) : undefined,
          enabled: formData.enabled,
          printedNum: formData.printedNum,
          displayOrder: formData.displayOrder,
          startNum: formData.startNum,
          printName: formData.printName.trim() || undefined,
          haveEmergency: formData.haveEmergency,
          isBackup: formData.isBackup,
          roomSubname: formData.roomSubname.trim() || undefined,
          lastPrintDate: formData.lastPrintDate ? new Date(formData.lastPrintDate) : undefined
        });
      }

      onSuccess();
      handleClose();
    } catch (err) {
      setError(`Failed to ${isEditMode ? 'update' : 'create'} room. Please try again.`);
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} room:`, err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      roomName: '',
      donviId: '',
      roomGroupId: '',
      enabled: true,
      lastPrintDate: '',
      printedNum: 0,
      displayOrder: 0,
      startNum: 0,
      printName: '',
      haveEmergency: false,
      isBackup: false,
      roomSubname: ''
    });
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-300 bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800 m-0">{isEditMode ? 'Edit Room' : 'Add New Room'}</h3>
          <button className="text-gray-400 hover:text-gray-600 text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors" onClick={handleClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{error}</div>}

          <div className="space-y-2">
            <label htmlFor="roomName" className="block text-sm font-medium text-gray-700">Room Name *</label>
            <input
              type="text"
              id="roomName"
              name="roomName"
              value={formData.roomName}
              onChange={handleInputChange}
              placeholder="Enter room name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="donviId" className="block text-sm font-medium text-gray-700">Donvi *</label>
            <select
              id="donviId"
              name="donviId"
              value={formData.donviId}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select Donvi</option>
              {donviData.map(donvi => (
                <option key={donvi.id} value={donvi.id}>
                  {donvi.tenDonvi}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="roomGroupId" className="block text-sm font-medium text-gray-700">Room Group</label>
            <select
              id="roomGroupId"
              name="roomGroupId"
              value={formData.roomGroupId}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Room Group (Optional)</option>
              {roomGroupData.map(group => (
                <option key={group.id} value={group.id}>
                  {group.groupName}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="roomSubname" className="block text-sm font-medium text-gray-700">Room Subname</label>
            <input
              type="text"
              id="roomSubname"
              name="roomSubname"
              value={formData.roomSubname}
              onChange={handleInputChange}
              placeholder="Enter room subname"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="printName" className="block text-sm font-medium text-gray-700">Print Name</label>
            <input
              type="text"
              id="printName"
              name="printName"
              value={formData.printName}
              onChange={handleInputChange}
              placeholder="Enter print name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label htmlFor="displayOrder" className="block text-sm font-medium text-gray-700">Display Order</label>
              <input
                type="number"
                id="displayOrder"
                name="displayOrder"
                value={formData.displayOrder}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="startNum" className="block text-sm font-medium text-gray-700">Start Number</label>
              <input
                type="number"
                id="startNum"
                name="startNum"
                value={formData.startNum}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="printedNum" className="block text-sm font-medium text-gray-700">Printed Number</label>
              <input
                type="number"
                id="printedNum"
                name="printedNum"
                value={formData.printedNum}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="lastPrintDate" className="block text-sm font-medium text-gray-700">Last Print Date</label>
              <input
                type="date"
                id="lastPrintDate"
                name="lastPrintDate"
                value={formData.lastPrintDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="enabled"
                  checked={formData.enabled}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Enabled</span>
              </label>
            </div>

            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="haveEmergency"
                  checked={formData.haveEmergency}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Have Emergency</span>
              </label>
            </div>

            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="isBackup"
                  checked={formData.isBackup}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Is Backup</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors" onClick={handleClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors" disabled={loading}>
              {loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Room' : 'Create Room')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoomPopup;