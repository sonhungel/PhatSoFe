import { useState, useEffect } from 'react';
import { createDonvi, } from '../../../services/managementService';
import './DonviPopup.css';

interface DonviPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const DonviPopup = ({ isOpen, onClose, onSuccess }: DonviPopupProps) => {
  const [formData, setFormData] = useState({
    tenDonvi: '',
    enable: true,
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setFormData({
        tenDonvi: '',
        enable: true,
        username: '',
        password: ''
    })
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
        await createDonvi(formData);
      onSuccess();
      onClose();
    } catch (err) {
      setError('Failed to save Donvi');
      console.error('Error saving Donvi:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h3>Add Donvi</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="popup-form">
          <div className="popup-body">
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label htmlFor="tenDonvi">Ten Donvi *</label>
              <input
                type="text"
                id="tenDonvi"
                name="tenDonvi"
                value={formData.tenDonvi}
                onChange={handleInputChange}
                placeholder="Enter ten donvi"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="username">Username *</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter username"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter password"
                required
              />
            </div>

            <div className="form-group checkbox-group">
              <label htmlFor="enable">
                <input
                  type="checkbox"
                  id="enable"
                  name="enable"
                  checked={formData.enable}
                  onChange={handleInputChange}
                />
                Enable
              </label>
            </div>
          </div>
          <div className="popup-actions">
            <button type="button" className="cancel-btn" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Creating...' : 'Create Donvi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DonviPopup;