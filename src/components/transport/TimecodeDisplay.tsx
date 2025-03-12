import React from 'react';
import usePlayback from '../../hooks/usePlayback';

const TimecodeDisplay: React.FC = () => {
  const { playheadPosition, formatPlayheadPosition } = usePlayback();
  
  return (
    <div className="timecode-display">
      <div className="timecode-value">
        {formatPlayheadPosition()}
      </div>
      <div className="timecode-label">BAR:BEAT:TICK</div>
    </div>
  );
};

export default TimecodeDisplay;