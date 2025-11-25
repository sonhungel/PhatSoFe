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
    <div className="confirmation-popup-overlay">
      <div className="confirmation-popup">
        <div className="confirmation-popup-header">
          <h3>Confirm Action</h3>
        </div>
        <div className="confirmation-popup-body">
          <p>{message}</p>
        </div>
        <div className="confirmation-popup-footer">
          <button className="confirm-btn" onClick={onConfirm}>
            Yes
          </button>
          <button className="cancel-btn" onClick={onCancel}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPopup;