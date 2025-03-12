import React from 'react';

const Playhead: React.FC = () => {
  // Position would be controlled by playback state
  const position = 0; 
  
  return (
    <div className="playhead" style={{ left: `${position}px` }}>
      <div className="playhead-line"></div>
      <div className="playhead-handle"></div>
    </div>
  );
};

export default Playhead;