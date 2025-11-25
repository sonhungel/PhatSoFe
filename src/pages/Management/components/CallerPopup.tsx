import { useState, useEffect } from 'react';
import type { DonviItem, RoomItem, CallerItem } from '../items/managementItem';
import { createCaller, GetRoomsByDonviWithoutValidateToken, updateCaller } from '../../../services/managementService';
import './CallerPopup.css';
import { mapRoomsToRoomItems } from '../../../map';

interface CallerPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  donviData: DonviItem[];
  editData?: CallerItem;
}

const CallerPopup = ({ isOpen, onClose, onSuccess, donviData, editData }: CallerPopupProps) => {
  const [formData, setFormData] = useState({
    callerName: '',
    passVerify: '',
    donviId: '',
    roomId: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [roomData, setRoomData] = useState<RoomItem[]>([]);

  const isEditMode = !!editData;

  useEffect(() => {
    if(formData.donviId !== '')
    {
        GetRoomsByDonviWithoutValidateToken(parseInt(formData.donviId)).then((roomData) => {
          setRoomData(mapRoomsToRoomItems(roomData));
        });
    }
  },[formData.donviId])

  useEffect(() => {
    if (editData) {
      setFormData({
        callerName: editData.callerName,
        passVerify: editData.passVerify,
        donviId: editData.donviId.toString(),
        roomId: editData.roomId.toString()
      });
    } else {
      setFormData({
        callerName: '',
        passVerify: '',
        donviId: '',
        roomId: ''
      });
    }
    setError('');
  }, [editData, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.callerName.trim()) {
      setError('Caller name is required');
      return;
    }
    if (!formData.passVerify.trim()) {
      setError('Pass verify is required');
      return;
    }
    if (!formData.donviId) {
      setError('Please select a Donvi');
      return;
    }
    if (!formData.roomId) {
      setError('Please select a Room');
      return;
    }

    setLoading(true);
    try {
      if (isEditMode && editData) {
        await updateCaller({
          id: editData.id,
          callerName: formData.callerName.trim(),
          passVerify: formData.passVerify.trim(),
          donviId: parseInt(formData.donviId),
          roomId: parseInt(formData.roomId)
        });
      } else {
        await createCaller({
          callerName: formData.callerName.trim(),
          passVerify: formData.passVerify.trim(),
          donviId: parseInt(formData.donviId),
          roomId: parseInt(formData.roomId)
        });
      }

      onSuccess();
      handleClose();
    } catch (err) {
      setError(`Failed to ${isEditMode ? 'update' : 'create'} caller. Please try again.`);
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} caller:`, err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      callerName: '',
      passVerify: '',
      donviId: '',
      roomId: ''
    });
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h3>{isEditMode ? 'Edit Caller' : 'Add New Caller'}</h3>
          <button className="close-btn" onClick={handleClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="popup-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="callerName">Caller Name *</label>
            <input
              type="text"
              id="callerName"
              name="callerName"
              value={formData.callerName}
              onChange={handleInputChange}
              placeholder="Enter caller name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="passVerify">Pass Verify *</label>
            <input
              type="text"
              id="passVerify"
              name="passVerify"
              value={formData.passVerify}
              onChange={handleInputChange}
              placeholder="Enter pass verify"
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
            <label htmlFor="roomId">Room *</label>
            <select
              id="roomId"
              name="roomId"
              value={formData.roomId}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Room</option>
              {roomData.map(room => (
                <option key={room.id} value={room.id}>
                  {room.roomName}
                </option>
              ))}
            </select>
          </div>

          <div className="popup-actions">
            <button type="button" className="cancel-btn" onClick={handleClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Caller' : 'Create Caller')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CallerPopup;