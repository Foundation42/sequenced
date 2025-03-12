import React, { useContext } from 'react';
import useTimelineStore from '../../store/timelineStore';
import { TimelineContext } from './Timeline';

interface TimeRulerProps {
  zoom: number;
  pixelsPerBeat: number;
}

const TimeRuler: React.FC<TimeRulerProps> = ({ zoom, pixelsPerBeat }) => {
  const totalBeats = useTimelineStore(state => state.totalBeats);
  const timeSignature = useTimelineStore(state => state.timeSignature);
  const { beatToPixel } = useContext(TimelineContext);
  
  // Calculate the beats where we should show major and minor ticks
  const calculateTicks = () => {
    const ticks = [];
    const beatsPerBar = timeSignature.numerator;
    
    // Determine the optimal spacing between ticks based on zoom
    let majorTickSpacing, minorTickSpacing;
    
    if (zoom < 0.25) {
      majorTickSpacing = 8 * beatsPerBar; // Show every 8 bars
      minorTickSpacing = 2 * beatsPerBar; // Minor ticks every 2 bars
    } else if (zoom < 0.5) {
      majorTickSpacing = 4 * beatsPerBar; // Show every 4 bars
      minorTickSpacing = beatsPerBar; // Minor ticks every bar
    } else if (zoom < 1) {
      majorTickSpacing = beatsPerBar; // Show every bar
      minorTickSpacing = 1; // Minor ticks every beat
    } else if (zoom < 2) {
      majorTickSpacing = beatsPerBar; // Show every bar
      minorTickSpacing = 1; // Minor ticks every beat
    } else {
      majorTickSpacing = 1; // Show every beat
      minorTickSpacing = 0.25; // Minor ticks every quarter beat
    }
    
    // Generate ticks
    for (let beat = 0; beat <= totalBeats; beat += minorTickSpacing) {
      const isBar = beat % beatsPerBar === 0;
      const isMajor = beat % majorTickSpacing === 0;
      
      if (isMajor || isBar) {
        ticks.push({
          beat,
          isMajor,
          isBar
        });
      }
    }
    
    return ticks;
  };
  
  const ticks = calculateTicks();
  
  return (
    <div className="time-ruler">
      <div className="ruler-markings">
        {ticks.map(tick => (
          <div 
            key={tick.beat} 
            className={`ruler-mark ${tick.isMajor ? 'major-tick' : 'minor-tick'}`}
            style={{ 
              position: 'absolute',
              left: `${beatToPixel(tick.beat)}px`,
              height: tick.isMajor ? '100%' : '50%',
              bottom: 0,
              borderLeft: `1px solid ${tick.isMajor ? 'var(--text-color)' : 'var(--border-color)'}`,
              width: 0,
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'flex-start'
            }}
          >
            {tick.isMajor && (
              <span style={{ 
                fontSize: '0.8rem', 
                color: 'var(--text-light-color)', 
                marginLeft: '4px', 
                marginTop: '2px',
                whiteSpace: 'nowrap'
              }}>
                {tick.beat % timeSignature.numerator === 0 
                  ? Math.floor(tick.beat / timeSignature.numerator) + 1 // Bar number (1-indexed)
                  : Math.floor(tick.beat / timeSignature.numerator) + 1 + '.' + (tick.beat % timeSignature.numerator + 1) // Bar.beat
                }
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeRuler;