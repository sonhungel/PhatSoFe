import { useState, useEffect } from 'react';
import type { DonviItem, RoomGroupItem, RoomItem } from '../items/managementItem';
import { createRoom, getAllRoomGroupsByDonvi, updateRoom } from '../../../services/managementService';
import './RoomPopup.css';
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
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h3>{isEditMode ? 'Edit Room' : 'Add New Room'}</h3>
          <button className="close-btn" onClick={handleClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="popup-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="roomName">Room Name *</label>
            <input
              type="text"
              id="roomName"
              name="roomName"
              value={formData.roomName}
              onChange={handleInputChange}
              placeholder="Enter room name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="donviId">Donvi *</label>
            <select
              id="donviId"
              name="donviId"
              value={formData.donviId}
              onChange={handleInputChange}
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

          <div className="form-group">
            <label htmlFor="roomGroupId">Room Group</label>
            <select
              id="roomGroupId"
              name="roomGroupId"
              value={formData.roomGroupId}
              onChange={handleInputChange}
            >
              <option value="">Select Room Group (Optional)</option>
              {roomGroupData.map(group => (
                <option key={group.id} value={group.id}>
                  {group.groupName}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="roomSubname">Room Subname</label>
            <input
              type="text"
              id="roomSubname"
              name="roomSubname"
              value={formData.roomSubname}
              onChange={handleInputChange}
              placeholder="Enter room subname"
            />
          </div>

          <div className="form-group">
            <label htmlFor="printName">Print Name</label>
            <input
              type="text"
              id="printName"
              name="printName"
              value={formData.printName}
              onChange={handleInputChange}
              placeholder="Enter print name"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="displayOrder">Display Order</label>
              <input
                type="number"
                id="displayOrder"
                name="displayOrder"
                value={formData.displayOrder}
                onChange={handleInputChange}
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="startNum">Start Number</label>
              <input
                type="number"
                id="startNum"
                name="startNum"
                value={formData.startNum}
                onChange={handleInputChange}
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="printedNum">Printed Number</label>
              <input
                type="number"
                id="printedNum"
                name="printedNum"
                value={formData.printedNum}
                onChange={handleInputChange}
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastPrintDate">Last Print Date</label>
              <input
                type="date"
                id="lastPrintDate"
                name="lastPrintDate"
                value={formData.lastPrintDate}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="enabled"
                  checked={formData.enabled}
                  onChange={handleInputChange}
                />
                Enabled
              </label>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="haveEmergency"
                  checked={formData.haveEmergency}
                  onChange={handleInputChange}
                />
                Have Emergency
              </label>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="isBackup"
                  checked={formData.isBackup}
                  onChange={handleInputChange}
                />
                Is Backup
              </label>
            </div>
          </div>

          <div className="popup-actions">
            <button type="button" className="cancel-btn" onClick={handleClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Room' : 'Create Room')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoomPopup;