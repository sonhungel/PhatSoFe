import { useState, useEffect } from 'react';
import type { DonviItem, RoomGroupItem } from '../items/managementItem';
import { createRoomGroup, updateRoomGroup } from '../../../services/managementService';

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
    <div className="fixed inset-0 bg-gray-300 bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800 m-0">{isEditMode ? 'Edit Room Group' : 'Add New Room Group'}</h3>
          <button className="text-gray-400 hover:text-gray-600 text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors" onClick={handleClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{error}</div>}

          <div className="space-y-2">
            <label htmlFor="groupName" className="block text-sm font-medium text-gray-700">Group Name *</label>
            <input
              type="text"
              id="groupName"
              name="groupName"
              value={formData.groupName}
              onChange={handleInputChange}
              placeholder="Enter group name"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="minNum" className="block text-sm font-medium text-gray-700">Min Number *</label>
              <input
                type="number"
                id="minNum"
                name="minNum"
                value={formData.minNum}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="maxNum" className="block text-sm font-medium text-gray-700">Max Number *</label>
              <input
                type="number"
                id="maxNum"
                name="maxNum"
                value={formData.maxNum}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors" onClick={handleClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors" disabled={loading}>
              {loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Room Group' : 'Create Room Group')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoomGroupPopup;