import { useState, useEffect } from 'react';
import type { DonviItem, RoomGroupItem } from '../items/managementItem';
import { createRoomGroup, updateRoomGroup } from '../../../services/managementService';
import './RoomGroupPopup.css';

interface RoomGroupPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  donviData: DonviItem[];
  editData?: RoomGroupItem;
}

const RoomGroupPopup = ({ isOpen, onClose, onSuccess, donviData, editData }: RoomGroupPopupProps) => {
  const [formData, setFormData] = useState({
    groupName: '',
    minNum: 0,
    maxNum: 0,
    donviId: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEditMode = !!editData;

  useEffect(() => {
    if (editData) {
      setFormData({
        groupName: editData.groupName,
        minNum: editData.minNum,
        maxNum: editData.maxNum,
        donviId: editData.donviId.toString()
      });
    } else {
      setFormData({
        groupName: '',
        minNum: 0,
        maxNum: 0,
        donviId: ''
      });
    }
    setError('');
  }, [editData, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.groupName.trim()) {
      setError('Group name is required');
      return;
    }
    if (!formData.donviId) {
      setError('Please select a Donvi');
      return;
    }
    if (formData.minNum >= formData.maxNum) {
      setError('Min number must be less than max number');
      return;
    }

    setLoading(true);
    try {
      if (isEditMode && editData) {
        await updateRoomGroup(editData.id, {
          id: editData.id,
          groupName: formData.groupName.trim(),
          minNum: formData.minNum,
          maxNum: formData.maxNum,
          donviId: parseInt(formData.donviId)
        });
      } else {
        await createRoomGroup({
          groupName: formData.groupName.trim(),
          minNum: formData.minNum,
          maxNum: formData.maxNum,
          donviId: parseInt(formData.donviId)
        });
      }

      onSuccess();
      handleClose();
    } catch (err) {
      setError(`Failed to ${isEditMode ? 'update' : 'create'} room group. Please try again.`);
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} room group:`, err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      groupName: '',
      minNum: 0,
      maxNum: 0,
      donviId: ''
    });
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h3>{isEditMode ? 'Edit Room Group' : 'Add New Room Group'}</h3>
          <button className="close-btn" onClick={handleClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="popup-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="groupName">Group Name *</label>
            <input
              type="text"
              id="groupName"
              name="groupName"
              value={formData.groupName}
              onChange={handleInputChange}
              placeholder="Enter group name"
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

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="minNum">Min Number *</label>
              <input
                type="number"
                id="minNum"
                name="minNum"
                value={formData.minNum}
                onChange={handleInputChange}
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="maxNum">Max Number *</label>
              <input
                type="number"
                id="maxNum"
                name="maxNum"
                value={formData.maxNum}
                onChange={handleInputChange}
                min="0"
                required
              />
            </div>
          </div>

          <div className="popup-actions">
            <button type="button" className="cancel-btn" onClick={handleClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Room Group' : 'Create Room Group')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoomGroupPopup;