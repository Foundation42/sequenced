import { useState, useCallback } from 'react';

interface Clip {
  id: string;
  trackId: string;
  startTime: number;
  duration: number;
  content: string;
  status: 'idle' | 'processing' | 'complete' | 'error';
}

interface Track {
  id: string;
  name: string;
  type: string;
  position: number;
  clips: Clip[];
  groupId: string | null;
  isGroup: boolean;
  muted: boolean;
  solo: boolean;
}

interface TimelineState {
  tracks: Track[];
  selectedTrackIds: string[];
  selectedClipIds: string[];
  playheadPosition: number;
  isPlaying: boolean;
  zoom: number;
}

const useTimeline = () => {
  const [state, setState] = useState<TimelineState>({
    tracks: [],
    selectedTrackIds: [],
    selectedClipIds: [],
    playheadPosition: 0,
    isPlaying: false,
    zoom: 1
  });

  const addTrack = useCallback((track: Omit<Track, 'clips' | 'position'>) => {
    setState(prev => ({
      ...prev,
      tracks: [
        ...prev.tracks,
        {
          ...track,
          clips: [],
          position: prev.tracks.length
        }
      ]
    }));
  }, []);

  const removeTrack = useCallback((trackId: string) => {
    setState(prev => ({
      ...prev,
      tracks: prev.tracks.filter(track => track.id !== trackId)
    }));
  }, []);

  const addClip = useCallback((clip: Omit<Clip, 'id' | 'status'>) => {
    const newClip: Clip = {
      ...clip,
      id: `clip-${Date.now()}`,
      status: 'idle'
    };

    setState(prev => ({
      ...prev,
      tracks: prev.tracks.map(track => 
        track.id === clip.trackId 
          ? { ...track, clips: [...track.clips, newClip] } 
          : track
      )
    }));

    return newClip.id;
  }, []);

  const updateClip = useCallback((clipId: string, updates: Partial<Clip>) => {
    setState(prev => ({
      ...prev,
      tracks: prev.tracks.map(track => ({
        ...track,
        clips: track.clips.map(clip => 
          clip.id === clipId ? { ...clip, ...updates } : clip
        )
      }))
    }));
  }, []);

  const removeClip = useCallback((clipId: string) => {
    setState(prev => ({
      ...prev,
      tracks: prev.tracks.map(track => ({
        ...track,
        clips: track.clips.filter(clip => clip.id !== clipId)
      }))
    }));
  }, []);

  const selectTrack = useCallback((trackId: string, isMultiSelect = false) => {
    setState(prev => ({
      ...prev,
      selectedTrackIds: isMultiSelect 
        ? [...prev.selectedTrackIds, trackId]
        : [trackId]
    }));
  }, []);

  const selectClip = useCallback((clipId: string, isMultiSelect = false) => {
    setState(prev => ({
      ...prev,
      selectedClipIds: isMultiSelect 
        ? [...prev.selectedClipIds, clipId]
        : [clipId]
    }));
  }, []);

  const setPlayheadPosition = useCallback((position: number) => {
    setState(prev => ({
      ...prev,
      playheadPosition: position
    }));
  }, []);

  const togglePlayback = useCallback(() => {
    setState(prev => ({
      ...prev,
      isPlaying: !prev.isPlaying
    }));
  }, []);

  const setZoom = useCallback((zoom: number) => {
    setState(prev => ({
      ...prev,
      zoom: Math.max(0.1, Math.min(10, zoom))
    }));
  }, []);

  return {
    state,
    addTrack,
    removeTrack,
    addClip,
    updateClip,
    removeClip,
    selectTrack,
    selectClip,
    setPlayheadPosition,
    togglePlayback,
    setZoom
  };
};

export default useTimeline;