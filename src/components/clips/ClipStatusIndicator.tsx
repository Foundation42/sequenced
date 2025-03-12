import React from 'react';

interface ClipStatusIndicatorProps {
  status: 'idle' | 'processing' | 'complete' | 'error';
}

const ClipStatusIndicator: React.FC<ClipStatusIndicatorProps> = ({ status }) => {
  const getStatusLabel = () => {
    switch (status) {
      case 'idle': return 'Not processed';
      case 'processing': return 'Processing...';
      case 'complete': return 'Completed';
      case 'error': return 'Error';
      default: return '';
    }
  };

  return (
    <div className={`clip-status status-${status}`} title={getStatusLabel()}>
      {status === 'processing' && <div className="processing-animation"></div>}
    </div>
  );
};

export default ClipStatusIndicator;