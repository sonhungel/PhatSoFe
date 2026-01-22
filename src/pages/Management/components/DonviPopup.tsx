import { useState, useEffect } from 'react';
import { createDonvi, } from '../../../services/managementService';

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
    <div className="fixed inset-0 bg-gray-300 bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800 m-0">Thêm đơn vị</h3>
          <button className="text-gray-400 hover:text-gray-600 text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 overflow-y-auto flex-1">
            {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 border border-red-200">{error}</div>}

            <div className="flex flex-col gap-2 mb-4">
              <label htmlFor="tenDonvi" className="text-sm font-medium text-gray-700">Tên đơn vị *</label>
              <input
                type="text"
                id="tenDonvi"
                name="tenDonvi"
                value={formData.tenDonvi}
                onChange={handleInputChange}
                placeholder="Nhập tên đơn vị"
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                required
              />
            </div>

            <div className="flex flex-col gap-2 mb-4">
              <label htmlFor="username" className="text-sm font-medium text-gray-700">Tên đăng nhập *</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Nhập tên đăng nhập"
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                required
              />
            </div>

            <div className="flex flex-col gap-2 mb-4">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">Mật khẩu *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Nhập mật khẩu"
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="enable"
                name="enable"
                checked={formData.enable}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="enable" className="text-sm font-medium text-gray-700">Kích hoạt</label>
            </div>
          </div>
          <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
            <button type="button" className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded font-medium text-sm transition-colors disabled:opacity-50" onClick={onClose} disabled={loading}>
              Hủy
            </button>
            <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-medium text-sm transition-colors disabled:opacity-50" disabled={loading}>
              {loading ? 'Đang tạo...' : 'Tạo đơn vị'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DonviPopup;