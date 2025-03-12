import React from 'react';
import TimecodeDisplay from './TimecodeDisplay';

const TransportControls: React.FC = () => {
  const handlePlayPause = () => {
    console.log('Play/Pause');
  };
  
  const handleStop = () => {
    console.log('Stop');
  };
  
  const handleRecord = () => {
    console.log('Record');
  };
  
  const handleRewind = () => {
    console.log('Rewind');
  };
  
  const handleForward = () => {
    console.log('Forward');
  };

  return (
    <div className="transport-controls">
      <div className="transport-buttons">
        <button 
          className="transport-button rewind-button" 
          onClick={handleRewind}
          aria-label="Rewind"
        >
          ⏪
        </button>
        <button 
          className="transport-button stop-button" 
          onClick={handleStop}
          aria-label="Stop"
        >
          ⏹️
        </button>
        <button 
          className="transport-button play-button" 
          onClick={handlePlayPause}
          aria-label="Play/Pause"
        >
          ⏯️
        </button>
        <button 
          className="transport-button record-button" 
          onClick={handleRecord}
          aria-label="Record"
        >
          ⏺️
        </button>
        <button 
          className="transport-button forward-button" 
          onClick={handleForward}
          aria-label="Forward"
        >
          ⏩
        </button>
      </div>
      
      <TimecodeDisplay />
      
      <div className="tempo-control">
        <label htmlFor="tempo-input">Tempo:</label>
        <input 
          id="tempo-input"
          type="number" 
          min="20" 
          max="300" 
          defaultValue="120" 
        />
        <span>BPM</span>
      </div>
    </div>
  );
};

export default TransportControls;