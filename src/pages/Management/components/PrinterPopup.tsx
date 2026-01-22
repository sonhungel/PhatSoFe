import { useState, useEffect } from 'react';
import type { DonviItem, PrinterItem } from '../items/managementItem';
import { createPrinter, updatePrinter } from '../../../services/managementService';

interface PrinterPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  donviData: DonviItem[];
  editData?: PrinterItem;
}

const PrinterPopup = ({ isOpen, onClose, onSuccess, donviData, editData }: PrinterPopupProps) => {
  const [formData, setFormData] = useState({
    name: '',
    donviId: '',
    enable: true,
    passVerify: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEditMode = !!editData;

  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.name,
        donviId: editData.donviId.toString(),
        enable: editData.enable,
        passVerify: editData.passVerify
      });
    } else {
      setFormData({
        name: '',
        donviId: '',
        enable: true,
        passVerify: ''
      });
    }
    setError('');
  }, [editData, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name.trim()) {
      setError('Printer name is required');
      return;
    }
    if (!formData.donviId) {
      setError('Please select a Donvi');
      return;
    }

    setLoading(true);
    try {
      if (isEditMode && editData) {
        await updatePrinter(editData.id, {
          id: editData.id,
          name: formData.name.trim(),
          donviId: parseInt(formData.donviId),
          enable: formData.enable,
          passVerify: formData.passVerify.trim() || undefined
        });
      } else {
        await createPrinter({
          name: formData.name.trim(),
          donviId: parseInt(formData.donviId),
          enable: formData.enable,
          passVerify: formData.passVerify.trim() || undefined
        });
      }

      onSuccess();
      handleClose();
    } catch (err) {
      setError(`Failed to ${isEditMode ? 'update' : 'create'} printer. Please try again.`);
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} printer:`, err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      donviId: '',
      enable: true,
      passVerify: ''
    });
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-300 bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800 m-0">{isEditMode ? 'Edit Printer' : 'Add New Printer'}</h3>
          <button className="text-gray-400 hover:text-gray-600 text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors" onClick={handleClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{error}</div>}

          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Printer Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter printer name"
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
            <label htmlFor="passVerify" className="block text-sm font-medium text-gray-700">Pass Verify</label>
            <input
              type="text"
              id="passVerify"
              name="passVerify"
              value={formData.passVerify}
              onChange={handleInputChange}
              placeholder="Enter pass verify (optional)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="enable"
                checked={formData.enable}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Enable</span>
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors" onClick={handleClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors" disabled={loading}>
              {loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Printer' : 'Create Printer')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PrinterPopup;