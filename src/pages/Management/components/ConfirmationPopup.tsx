import React from 'react';

interface ConfirmationPopupProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationPopup: React.FC<ConfirmationPopupProps> = ({
  isOpen,
  message,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl min-w-80 max-w-md overflow-hidden">
        <div className="bg-gray-50 p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 m-0">Confirm Action</h3>
        </div>
        <div className="p-6">
          <p className="text-gray-700 text-base leading-relaxed m-0 text-center">{message}</p>
        </div>
        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded font-medium text-sm transition-colors" onClick={onConfirm}>
            Yes
          </button>
          <button className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded font-medium text-sm transition-colors" onClick={onCancel}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPopup;