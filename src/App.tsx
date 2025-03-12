import React, { useEffect } from 'react';
import AppLayout from './components/layout/AppLayout';
import useTimelineStore from './store/timelineStore';
import './styles/global.css';
import './styles/timeline.css';
import './styles/devices.css';

function App() {
  const { addTrack, addClip } = useTimelineStore();
  
  // Initialize some example data when the app starts
  useEffect(() => {
    // Add tracks
    const midiTrackId = addTrack({
      name: 'MIDI Track',
      type: 'midi',
      color: '#48bb78',
    });
    
    const visualTrackId = addTrack({
      name: 'Visualization',
      type: 'visualization',
      color: '#805ad5',
    });
    
    const textTrackId = addTrack({
      name: 'Text Output',
      type: 'text',
      color: '#4299e1',
    });
    
    // Add clips to the tracks
    addClip({
      trackId: midiTrackId,
      startTime: 0,
      duration: 4,
      content: 'Generate a funky bass line in E minor',
      status: 'idle',
    });
    
    addClip({
      trackId: midiTrackId,
      startTime: 8,
      duration: 8,
      content: 'Create a drum pattern with emphasis on the off-beat',
      status: 'complete',
    });
    
    addClip({
      trackId: visualTrackId,
      startTime: 2,
      duration: 6,
      content: 'Create a visualization with flowing blue and purple shapes',
      status: 'idle',
    });
    
    addClip({
      trackId: textTrackId,
      startTime: 4,
      duration: 4,
      content: 'Generate lyrics about digital dreams',
      status: 'processing',
    });
  }, [addTrack, addClip]);
  
  return (
    <AppLayout />
  );
}

export default App;