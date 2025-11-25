import { useState, useEffect } from 'react';
import type { DonviItem, PrinterItem } from '../items/managementItem';
import { createPrinter, updatePrinter } from '../../../services/managementService';
import './PrinterPopup.css';

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
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h3>{isEditMode ? 'Edit Printer' : 'Add New Printer'}</h3>
          <button className="close-btn" onClick={handleClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="popup-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="name">Printer Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter printer name"
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
            <label htmlFor="passVerify">Pass Verify</label>
            <input
              type="text"
              id="passVerify"
              name="passVerify"
              value={formData.passVerify}
              onChange={handleInputChange}
              placeholder="Enter pass verify (optional)"
            />
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="enable"
                checked={formData.enable}
                onChange={handleInputChange}
              />
              Enable
            </label>
          </div>

          <div className="popup-actions">
            <button type="button" className="cancel-btn" onClick={handleClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Printer' : 'Create Printer')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PrinterPopup;