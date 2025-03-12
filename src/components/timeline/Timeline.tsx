import React, { createContext, useRef } from 'react';
import TimeRuler from './TimeRuler';
import TrackList from './TrackList';
import Playhead from './Playhead';
import useTimelineView from '../../hooks/useTimelineView';
import useTimelineStore from '../../store/timelineStore';

// Create a context to provide timeline-related functions to child components
interface TimelineContextValue {
  beatToPixel: (beat: number) => number;
  pixelToBeat: (pixel: number) => number;
  zoom: number;
}

export const TimelineContext = createContext<TimelineContextValue>({
  beatToPixel: (beat) => beat * 100,
  pixelToBeat: (pixel) => pixel / 100,
  zoom: 1
});

const Timeline: React.FC = () => {
  const tracks = useTimelineStore(state => Object.values(state.tracks));
  const totalBeats = useTimelineStore(state => state.totalBeats);
  
  // Ref for the scrollable container
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Timeline view hook for zoom/scroll
  const {
    containerRef,
    state: viewState,
    handleScroll,
    handleWheel,
    beatToPixel,
    pixelToBeat
  } = useTimelineView(totalBeats, tracks.length);
  
  // Context value for child components
  const contextValue: TimelineContextValue = {
    beatToPixel,
    pixelToBeat,
    zoom: viewState.zoom
  };
  
  return (
    <TimelineContext.Provider value={contextValue}>
      <div className="timeline-container">
        <TimeRuler zoom={viewState.zoom} pixelsPerBeat={viewState.pixelsPerBeat} />
        <div 
          ref={containerRef}
          className="timeline-content"
          onScroll={handleScroll}
          onWheel={handleWheel}
        >
          <div 
            ref={contentRef}
            className="timeline-content-inner" 
            style={{
              width: `${viewState.contentWidth}px`,
              minHeight: '100%',
              position: 'relative'
            }}
          >
            <Playhead timelineRef={containerRef} />
            <TrackList />
          </div>
        </div>
      </div>
    </TimelineContext.Provider>
  );
};

export default Timeline;