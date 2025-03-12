import React from 'react';
import Track from './Track';
import TrackGroup from './TrackGroup';

const TrackList: React.FC = () => {
  // This would come from application state
  const mockTracks = [
    { id: '1', name: 'Track 1', type: 'midi' },
    { id: '2', name: 'Track 2', type: 'midi' },
    { 
      id: '3', 
      name: 'Group 1', 
      type: 'group',
      children: [
        { id: '4', name: 'Track 3', type: 'midi' },
        { id: '5', name: 'Track 4', type: 'visualization' }
      ]
    }
  ];
  
  return (
    <div className="track-list">
      {mockTracks.map(track => (
        track.type === 'group' ? (
          <TrackGroup key={track.id} id={track.id} name={track.name} tracks={track.children} />
        ) : (
          <Track key={track.id} id={track.id} name={track.name} type={track.type} />
        )
      ))}
      <button className="add-track-button">Add Track</button>
    </div>
  );
};

export default TrackList;