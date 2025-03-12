import React from 'react';

interface ClipContextMenuProps {
  clipId: string;
  position: { x: number; y: number };
  onClose: () => void;
}

const ClipContextMenu: React.FC<ClipContextMenuProps> = ({ 
  clipId, 
  position, 
  onClose 
}) => {
  const handleAction = (action: string) => {
    console.log(`Action ${action} on clip ${clipId}`);
    onClose();
  };

  return (
    <div 
      className="context-menu clip-context-menu" 
      style={{ top: position.y, left: position.x }}
    >
      <ul>
        <li onClick={() => handleAction('edit')}>Edit</li>
        <li onClick={() => handleAction('process')}>Process</li>
        <li onClick={() => handleAction('duplicate')}>Duplicate</li>
        <li onClick={() => handleAction('split')}>Split</li>
        <li onClick={() => handleAction('delete')}>Delete</li>
      </ul>
    </div>
  );
};

export default ClipContextMenu;