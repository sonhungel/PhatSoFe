import { useState, useEffect } from 'react';
import type { DonviItem, RoomItem, CallerItem } from '../items/managementItem';
import { createCaller, GetRoomsByDonviWithoutValidateToken, updateCaller } from '../../../services/managementService';
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
    <div className="fixed inset-0 bg-gray-300 bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800 m-0">{isEditMode ? 'Edit Caller' : 'Add New Caller'}</h3>
          <button className="text-gray-400 hover:text-gray-600 text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors" onClick={handleClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto">
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 border border-red-200">{error}</div>}

          <div className="flex flex-col gap-2 mb-4">
            <label htmlFor="callerName" className="text-sm font-medium text-gray-700">Caller Name *</label>
            <input
              type="text"
              id="callerName"
              name="callerName"
              value={formData.callerName}
              onChange={handleInputChange}
              placeholder="Enter caller name"
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              required
            />
          </div>

          <div className="flex flex-col gap-2 mb-4">
            <label htmlFor="passVerify" className="text-sm font-medium text-gray-700">Pass Verify *</label>
            <input
              type="text"
              id="passVerify"
              name="passVerify"
              value={formData.passVerify}
              onChange={handleInputChange}
              placeholder="Enter pass verify"
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              required
            />
          </div>

          <div className="flex flex-col gap-2 mb-4">
            <label htmlFor="donviId" className="text-sm font-medium text-gray-700">Donvi *</label>
            <select
              id="donviId"
              name="donviId"
              value={formData.donviId}
              onChange={handleInputChange}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white"
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

          <div className="flex flex-col gap-2 mb-6">
            <label htmlFor="roomId" className="text-sm font-medium text-gray-700">Room *</label>
            <select
              id="roomId"
              name="roomId"
              value={formData.roomId}
              onChange={handleInputChange}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white"
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

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button type="button" className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded font-medium text-sm transition-colors disabled:opacity-50" onClick={handleClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-medium text-sm transition-colors disabled:opacity-50" disabled={loading}>
              {loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Caller' : 'Create Caller')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CallerPopup;