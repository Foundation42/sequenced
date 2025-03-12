import { create } from 'zustand';
import { nanoid } from 'nanoid';
import { Clip, Track, Device, ClipProcessingStatus } from '../types';

interface TimelineState {
  tracks: Record<string, Track>;
  clips: Record<string, Clip>;
  selectedTrackIds: string[];
  selectedClipIds: string[];
  playheadPosition: number;
  isPlaying: boolean;
  totalBeats: number;
  tempo: number;
  timeSignature: {
    numerator: number;
    denominator: number;
  };
  
  // Track actions
  addTrack: (track: Partial<Track>) => string;
  removeTrack: (trackId: string) => void;
  updateTrack: (trackId: string, updates: Partial<Track>) => void;
  moveTrack: (trackId: string, newPosition: number) => void;
  reorderTracks: () => void;
  selectTrack: (trackId: string, isMultiSelect?: boolean) => void;
  deselectTrack: (trackId: string) => void;
  deselectAllTracks: () => void;
  
  // Clip actions
  addClip: (clip: Partial<Clip>) => string;
  updateClip: (clipId: string, updates: Partial<Clip>) => void;
  removeClip: (clipId: string) => void;
  moveClip: (clipId: string, newStartTime: number, newTrackId?: string) => void;
  resizeClip: (clipId: string, newDuration: number) => void;
  splitClip: (clipId: string, splitPoint: number) => string;
  selectClip: (clipId: string, isMultiSelect?: boolean) => void;
  deselectClip: (clipId: string) => void;
  deselectAllClips: () => void;
  updateClipStatus: (clipId: string, status: ClipProcessingStatus, output?: any) => void;
  
  // Playback actions
  setPlayheadPosition: (position: number) => void;
  startPlayback: () => void;
  stopPlayback: () => void;
  togglePlayback: () => void;
  setTempo: (tempo: number) => void;
  setTimeSignature: (numerator: number, denominator: number) => void;
  
  // Project actions
  clear: () => void;
  loadProject: (tracks: Record<string, Track>, clips: Record<string, Clip>) => void;
}

const useTimelineStore = create<TimelineState>((set, get) => ({
  tracks: {},
  clips: {},
  selectedTrackIds: [],
  selectedClipIds: [],
  playheadPosition: 0,
  isPlaying: false,
  totalBeats: 64,
  tempo: 120,
  timeSignature: {
    numerator: 4,
    denominator: 4,
  },
  
  // Track actions
  addTrack: (trackData) => {
    const trackId = nanoid();
    
    // Find the highest position to place this track at the end
    const tracks = Object.values(get().tracks);
    const highestPosition = tracks.length ? Math.max(...tracks.map(t => t.position)) : -1;
    
    const newTrack: Track = {
      id: trackId,
      name: trackData.name || `Track ${tracks.length + 1}`,
      type: trackData.type || 'midi',
      position: trackData.position !== undefined ? trackData.position : highestPosition + 1,
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
      
      if (!removedTrack) return state;
      
      // Get all clip IDs of the track to remove
      const clipIdsToRemove = removedTrack.clips || [];
      
      // Create new clips object without the removed track's clips
      const newClips = { ...state.clips };
      clipIdsToRemove.forEach(clipId => {
        delete newClips[clipId];
      });
      
      // Remove the track ID from selection if present
      const newSelectedTrackIds = state.selectedTrackIds.filter(id => id !== trackId);
      
      return {
        tracks: remainingTracks,
        clips: newClips,
        selectedTrackIds: newSelectedTrackIds
      };
    });
    
    // Reorder tracks to ensure consistent positions
    get().reorderTracks();
  },
  
  updateTrack: (trackId, updates) => {
    set((state) => {
      const track = state.tracks[trackId];
      if (!track) return state;
      
      return {
        tracks: {
          ...state.tracks,
          [trackId]: {
            ...track,
            ...updates
          }
        }
      };
    });
  },
  
  moveTrack: (trackId, newPosition) => {
    set((state) => {
      const track = state.tracks[trackId];
      if (!track) return state;
      
      // Update the moved track's position
      const updatedTracks = {
        ...state.tracks,
        [trackId]: {
          ...track,
          position: newPosition
        }
      };
      
      return { tracks: updatedTracks };
    });
    
    // Reorder all tracks to ensure consistent positions
    get().reorderTracks();
  },
  
  reorderTracks: () => {
    set((state) => {
      const tracks = Object.values(state.tracks);
      
      // Sort tracks by current position
      tracks.sort((a, b) => a.position - b.position);
      
      // Update positions to be sequential
      const updatedTracks = { ...state.tracks };
      tracks.forEach((track, index) => {
        updatedTracks[track.id] = {
          ...track,
          position: index
        };
      });
      
      return { tracks: updatedTracks };
    });
  },
  
  selectTrack: (trackId, isMultiSelect = false) => {
    set((state) => {
      // Only update if the track exists
      if (!state.tracks[trackId]) return state;
      
      return {
        selectedTrackIds: isMultiSelect
          ? [...state.selectedTrackIds, trackId]
          : [trackId],
        // Clear clip selection if not multi-selecting
        selectedClipIds: isMultiSelect ? state.selectedClipIds : []
      };
    });
  },
  
  deselectTrack: (trackId) => {
    set((state) => ({
      selectedTrackIds: state.selectedTrackIds.filter(id => id !== trackId)
    }));
  },
  
  deselectAllTracks: () => {
    set({ selectedTrackIds: [] });
  },
  
  // Clip actions
  addClip: (clipData) => {
    const clipId = nanoid();
    const trackId = clipData.trackId || '';
    
    if (!trackId || !get().tracks[trackId]) {
      console.error('Cannot add clip: trackId is invalid');
      return '';
    }
    
    const newClip: Clip = {
      id: clipId,
      trackId,
      startTime: clipData.startTime !== undefined ? clipData.startTime : 0,
      duration: clipData.duration || 4,
      content: clipData.content || '',
      status: clipData.status || 'idle',
      output: clipData.output,
      dependencies: clipData.dependencies || [],
      outputRefs: clipData.outputRefs || [],
      context: clipData.context || '',
      processingOptions: clipData.processingOptions || {},
    };
    
    set((state) => {
      const track = state.tracks[trackId];
      
      return {
        clips: {
          ...state.clips,
          [clipId]: newClip
        },
        tracks: {
          ...state.tracks,
          [trackId]: {
            ...track,
            clips: [...track.clips, clipId]
          }
        }
      };
    });
    
    return clipId;
  },
  
  updateClip: (clipId, updates) => {
    set((state) => {
      const clip = state.clips[clipId];
      if (!clip) return state;
      
      return {
        clips: {
          ...state.clips,
          [clipId]: {
            ...clip,
            ...updates
          }
        }
      };
    });
  },
  
  removeClip: (clipId) => {
    set((state) => {
      const clip = state.clips[clipId];
      if (!clip) return state;
      
      const trackId = clip.trackId;
      const track = state.tracks[trackId];
      
      if (!track) return state;
      
      // Create new clips object without the removed clip
      const { [clipId]: removedClip, ...remainingClips } = state.clips;
      
      // Update the track's clips array
      const updatedTracks = {
        ...state.tracks,
        [trackId]: {
          ...track,
          clips: track.clips.filter(id => id !== clipId)
        }
      };
      
      // Remove from selected clips if present
      const updatedSelectedClips = state.selectedClipIds.filter(id => id !== clipId);
      
      return {
        clips: remainingClips,
        tracks: updatedTracks,
        selectedClipIds: updatedSelectedClips
      };
    });
  },
  
  moveClip: (clipId, newStartTime, newTrackId) => {
    set((state) => {
      const clip = state.clips[clipId];
      if (!clip) return state;
      
      const currentTrackId = clip.trackId;
      
      // If moving to a different track
      if (newTrackId && newTrackId !== currentTrackId) {
        const currentTrack = state.tracks[currentTrackId];
        const newTrack = state.tracks[newTrackId];
        
        // Ensure both tracks exist
        if (!currentTrack || !newTrack) return state;
        
        // Update clip's track reference
        const updatedClip = {
          ...clip,
          trackId: newTrackId,
          startTime: newStartTime
        };
        
        // Remove clip from current track
        const updatedCurrentTrack = {
          ...currentTrack,
          clips: currentTrack.clips.filter(id => id !== clipId)
        };
        
        // Add clip to new track
        const updatedNewTrack = {
          ...newTrack,
          clips: [...newTrack.clips, clipId]
        };
        
        return {
          clips: {
            ...state.clips,
            [clipId]: updatedClip
          },
          tracks: {
            ...state.tracks,
            [currentTrackId]: updatedCurrentTrack,
            [newTrackId]: updatedNewTrack
          }
        };
      } 
      // Just moving on the same track
      else {
        return {
          clips: {
            ...state.clips,
            [clipId]: {
              ...clip,
              startTime: newStartTime
            }
          }
        };
      }
    });
  },
  
  resizeClip: (clipId, newDuration) => {
    set((state) => {
      const clip = state.clips[clipId];
      if (!clip) return state;
      
      return {
        clips: {
          ...state.clips,
          [clipId]: {
            ...clip,
            duration: Math.max(1, newDuration) // Minimum duration of 1
          }
        }
      };
    });
  },
  
  splitClip: (clipId, splitPoint) => {
    const state = get();
    const clip = state.clips[clipId];
    
    if (!clip || splitPoint <= clip.startTime || splitPoint >= clip.startTime + clip.duration) {
      console.error('Invalid split point or clip not found');
      return '';
    }
    
    // Calculate durations for original and new clip
    const originalDuration = splitPoint - clip.startTime;
    const newDuration = (clip.startTime + clip.duration) - splitPoint;
    
    // Update original clip
    get().updateClip(clipId, { duration: originalDuration });
    
    // Create new clip
    const newClipId = get().addClip({
      trackId: clip.trackId,
      startTime: splitPoint,
      duration: newDuration,
      content: clip.content,
      status: 'idle',
      context: clip.context,
      processingOptions: clip.processingOptions
    });
    
    return newClipId;
  },
  
  selectClip: (clipId, isMultiSelect = false) => {
    set((state) => {
      // Only update if the clip exists
      if (!state.clips[clipId]) return state;
      
      return {
        selectedClipIds: isMultiSelect
          ? [...state.selectedClipIds, clipId]
          : [clipId],
        // Clear track selection if not multi-selecting
        selectedTrackIds: isMultiSelect ? state.selectedTrackIds : []
      };
    });
  },
  
  deselectClip: (clipId) => {
    set((state) => ({
      selectedClipIds: state.selectedClipIds.filter(id => id !== clipId)
    }));
  },
  
  deselectAllClips: () => {
    set({ selectedClipIds: [] });
  },
  
  updateClipStatus: (clipId, status, output) => {
    set((state) => {
      const clip = state.clips[clipId];
      if (!clip) return state;
      
      return {
        clips: {
          ...state.clips,
          [clipId]: {
            ...clip,
            status,
            output: output !== undefined ? output : clip.output
          }
        }
      };
    });
  },
  
  // Playback actions
  setPlayheadPosition: (position) => {
    set({ playheadPosition: Math.max(0, position) });
  },
  
  startPlayback: () => {
    set({ isPlaying: true });
  },
  
  stopPlayback: () => {
    set({ isPlaying: false });
  },
  
  togglePlayback: () => {
    set((state) => ({ isPlaying: !state.isPlaying }));
  },
  
  setTempo: (tempo) => {
    set({ tempo: Math.max(20, Math.min(300, tempo)) });
  },
  
  setTimeSignature: (numerator, denominator) => {
    set({
      timeSignature: {
        numerator: Math.max(1, Math.min(32, numerator)),
        denominator: [1, 2, 4, 8, 16, 32].includes(denominator) ? denominator : 4
      }
    });
  },
  
  // Project actions
  clear: () => {
    set({
      tracks: {},
      clips: {},
      selectedTrackIds: [],
      selectedClipIds: [],
      playheadPosition: 0,
      isPlaying: false
    });
  },
  
  loadProject: (tracks, clips) => {
    set({
      tracks,
      clips,
      selectedTrackIds: [],
      selectedClipIds: [],
      playheadPosition: 0,
      isPlaying: false
    });
  }
}));

export default useTimelineStore;