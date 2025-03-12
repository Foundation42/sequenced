import React, { useState } from 'react';
import TimecodeDisplay from './TimecodeDisplay';
import usePlayback from '../../hooks/usePlayback';
import useTimelineStore from '../../store/timelineStore';

const TransportControls: React.FC = () => {
  const { isPlaying, toggle, stop, jumpToPosition } = usePlayback();
  const { tempo, setTempo } = useTimelineStore();
  const [tempoValue, setTempoValue] = useState(tempo);
  
  const handlePlayPause = () => {
    toggle();
  };
  
  const handleStop = () => {
    stop();
    jumpToPosition(0);
  };
  
  const handleRecord = () => {
    // Record functionality would be implemented later
    console.log('Record not implemented yet');
  };
  
  const handleRewind = () => {
    jumpToPosition(0);
  };
  
  const handleForward = () => {
    // Skip ahead by 4 beats
    const { playheadPosition } = useTimelineStore.getState();
    jumpToPosition(Math.max(0, playheadPosition + 4));
  };
  
  const handleTempoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTempo = parseInt(e.target.value, 10);
    setTempoValue(newTempo);
  };
  
  const handleTempoBlur = () => {
    if (tempoValue !== tempo) {
      setTempo(tempoValue);
    }
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
          {isPlaying ? '⏸️' : '▶️'}
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
          value={tempoValue}
          onChange={handleTempoChange}
          onBlur={handleTempoBlur}
        />
        <span>BPM</span>
      </div>
    </div>
  );
};

export default TransportControls;