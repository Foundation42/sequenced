import React, { useState, useEffect } from 'react';

const TimecodeDisplay: React.FC = () => {
  const [currentTime, setCurrentTime] = useState({
    bars: 1,
    beats: 1,
    ticks: 0
  });

  // This would be connected to the actual playback state
  // For now, we'll just use a dummy value
  
  return (
    <div className="timecode-display">
      <div className="timecode-value">
        <span className="bars">{currentTime.bars.toString().padStart(2, '0')}</span>:
        <span className="beats">{currentTime.beats.toString().padStart(2, '0')}</span>:
        <span className="ticks">{currentTime.ticks.toString().padStart(3, '0')}</span>
      </div>
      <div className="timecode-label">BAR:BEAT:TICK</div>
    </div>
  );
};

export default TimecodeDisplay;