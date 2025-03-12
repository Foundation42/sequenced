import React from 'react';
import TimeRuler from './TimeRuler';
import TrackList from './TrackList';
import Playhead from './Playhead';

const Timeline: React.FC = () => {
  return (
    <div className="timeline-container">
      <TimeRuler />
      <div className="timeline-content">
        <Playhead />
        <TrackList />
      </div>
    </div>
  );
};

export default Timeline;