import { create } from 'zustand';

export interface Clip {
  id: string;
  trackId: string;
  startTime: number;
  duration: number;
  content: string;
  status: 'idle' | 'processing' | 'complete' | 'error';
  output?: any;
}

export interface Track {
  id: string;
  name: string;
  type: string;
  position: number;
  color: string;
  muted: boolean;
  solo: boolean;
  height: number;
  groupId: string | null;
  isGroup: boolean;
  clips: string[]; // Clip IDs
  context?: string;
}

interface TimelineState {
  tracks: Record<string, Track>;
  clips: Record<string, Clip>;
  selectedTrackIds: string[];
  selectedClipIds: string[];
  playheadPosition: number;
  isPlaying: boolean;
  zoom: number;
  tempo: number;
  
  // Actions
  addTrack: (track: Partial<Track>) => string;
  removeTrack: (trackId: string) => void;
  updateTrack: (trackId: string, updates: Partial<Track>) => void;
  addClip: (clip: Partial<Clip>) => string;
  updateClip: (clipId: string, updates: Partial<Clip>) => void;
  removeClip: (clipId: string) => void;
  selectTrack: (trackId: string, isMultiSelect?: boolean) => void;
  selectClip: (clipId: string, isMultiSelect?: boolean) => void;
  setPlayheadPosition: (position: number) => void;
  togglePlayback: () => void;
  setZoom: (zoom: number) => void;
  setTempo: (tempo: number) => void;
}

const useTimelineStore = create<TimelineState>((set) => ({
  tracks: {},
  clips: {},
  selectedTrackIds: [],
  selectedClipIds: [],
  playheadPosition: 0,
  isPlaying: false,
  zoom: 1,
  tempo: 120,
  
  addTrack: (trackData) => {
    const trackId = `track-${Date.now()}`;
    const newTrack: Track = {
      id: trackId,
      name: trackData.name || 'New Track',
      type: trackData.type || 'midi',
      position: trackData.position || 0,
      color: trackData.color || '#48bb78',
      muted: trackData.muted || false,
      solo: trackData.solo || false,
      height: trackData.height || 80,
      groupId: trackData.groupId || null,
      isGroup: trackData.isGroup || false,
      clips: trackData.clips || [],
      context: trackData.context || '',
    };
    
    set((state) => ({
      tracks: {
        ...state.tracks,
        [trackId]: newTrack
      }
    }));
    
    return trackId;
  },
  
  removeTrack: (trackId) => {
    set((state) => {
      // Create new objects excluding the track to remove
      const { [trackId]: removedTrack, ...remainingTracks } = state.tracks;
      
      // Get all clip IDs of the track to remove
      const clipIdsToRemove = removedTrack?.clips || [];
      
      // Create new clips object without the removed track's clips
      const newClips = { ...state.clips };
      clipIdsToRemove.forEach(clipId => {
        delete newClips[clipId];
      });
      
      return {
        tracks: remainingTracks,
        clips: newClips,
        selectedTrackIds: state.selectedTrackIds.filter(id => id !== trackId)
      };
    });
  },
  
  updateTrack: (trackId, updates) => {
    set((state) => ({
      tracks: {
        ...state.tracks,
        [trackId]: {
          ...state.tracks[trackId],
          ...updates
        }
      }
    }));
  },
  
  addClip: (clipData) => {
    const clipId = `clip-${Date.now()}`;
    const trackId = clipData.trackId || '';
    
    if (!trackId) {
      console.error('Cannot add clip: trackId is required');
      return '';
    }
    
    const newClip: Clip = {
      id: clipId,
      trackId,
      startTime: clipData.startTime || 0,
      duration: clipData.duration || 4,
      content: clipData.content || '',
      status: clipData.status || 'idle',
      output: clipData.output,
    };
    
    set((state) => ({
      clips: {
        ...state.clips,
        [clipId]: newClip
      },
      tracks: {
        ...state.tracks,
        [trackId]: {
          ...state.tracks[trackId],
          clips: [...state.tracks[trackId].clips, clipId]
        }
      }
    }));
    
    return clipId;
  },
  
  updateClip: (clipId, updates) => {
    set((state) => ({
      clips: {
        ...state.clips,
        [clipId]: {
          ...state.clips[clipId],
          ...updates
        }
      }
    }));
  },
  
  removeClip: (clipId) => {
    set((state) => {
      // Get the track this clip belongs to
      const track = Object.values(state.tracks).find(track => 
        track.clips.includes(clipId)
      );
      
      if (!track) {
        return state;
      }
      
      // Create new clips object without the removed clip
      const { [clipId]: removedClip, ...remainingClips } = state.clips;
      
      // Update the track's clips list
      const updatedTracks = {
        ...state.tracks,
        [track.id]: {
          ...track,
          clips: track.clips.filter(id => id !== clipId)
        }
      };
      
      return {
        clips: remainingClips,
        tracks: updatedTracks,
        selectedClipIds: state.selectedClipIds.filter(id => id !== clipId)
      };
    });
  },
  
  selectTrack: (trackId, isMultiSelect = false) => {
    set((state) => ({
      selectedTrackIds: isMultiSelect
        ? [...state.selectedTrackIds, trackId]
        : [trackId],
      // Clear clip selection if not multi-selecting
      selectedClipIds: isMultiSelect ? state.selectedClipIds : []
    }));
  },
  
  selectClip: (clipId, isMultiSelect = false) => {
    set((state) => ({
      selectedClipIds: isMultiSelect
        ? [...state.selectedClipIds, clipId]
        : [clipId],
      // Clear track selection if not multi-selecting
      selectedTrackIds: isMultiSelect ? state.selectedTrackIds : []
    }));
  },
  
  setPlayheadPosition: (position) => {
    set({ playheadPosition: position });
  },
  
  togglePlayback: () => {
    set((state) => ({ isPlaying: !state.isPlaying }));
  },
  
  setZoom: (zoom) => {
    set({ zoom: Math.max(0.1, Math.min(10, zoom)) });
  },
  
  setTempo: (tempo) => {
    set({ tempo: Math.max(20, Math.min(300, tempo)) });
  }
}));

export default useTimelineStore;