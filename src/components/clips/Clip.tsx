import React, { useState } from 'react';
import ClipContent from './ClipContent';
import ClipStatusIndicator from './ClipStatusIndicator';

interface ClipProps {
  id: string;
  content: string;
  style?: React.CSSProperties;
  status?: 'idle' | 'processing' | 'complete' | 'error';
}

const Clip: React.FC<ClipProps> = ({ 
  id, 
  content, 
  style = {}, 
  status = 'idle' 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  
  const handleDoubleClick = () => {
    setIsEditing(true);
  };
  
  const handleCloseEditor = () => {
    setIsEditing(false);
  };

  return (
    <>
      <div 
        className={`clip clip-status-${status}`}
        style={style}
        onDoubleClick={handleDoubleClick}
        data-clip-id={id}
      >
        <div className="clip-preview">
          {content.substring(0, 50)}{content.length > 50 ? '...' : ''}
        </div>
        <ClipStatusIndicator status={status} />
      </div>
      
      {isEditing && (
        <ClipContent 
          id={id}
          content={content} 
          onClose={handleCloseEditor}
        />
      )}
    </>
  );
};

export default Clip;