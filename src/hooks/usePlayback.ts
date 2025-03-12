import { useEffect, useRef, useCallback } from 'react';
import useTimelineStore from '../store/timelineStore';
import { musicalTimeToSeconds } from '../utils/timeUtils';

/**
 * Hook for handling playback functionality
 */
const usePlayback = () => {
  const {
    isPlaying,
    playheadPosition,
    tempo,
    timeSignature,
    startPlayback,
    stopPlayback,
    togglePlayback,
    setPlayheadPosition
  } = useTimelineStore();
  
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  
  // Handle playback animation
  const animatePlayback = useCallback((timestamp: number) => {
    if (!lastTimeRef.current) {
      lastTimeRef.current = timestamp;
      animationFrameRef.current = requestAnimationFrame(animatePlayback);
      return;
    }
    
    const deltaTime = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;
    
    // Calculate how much to advance the playhead (in beats)
    // 60000 ms / tempo = ms per beat
    const beatsPerMs = tempo / 60000;
    const beatDelta = beatsPerMs * deltaTime;
    
    // Update playhead position
    setPlayheadPosition(playheadPosition + beatDelta);
    
    // Continue animation
    animationFrameRef.current = requestAnimationFrame(animatePlayback);
  }, [playheadPosition, setPlayheadPosition, tempo]);
  
  // Start/stop playback based on isPlaying flag
  useEffect(() => {
    if (isPlaying) {
      // Start playback animation
      lastTimeRef.current = null;
      animationFrameRef.current = requestAnimationFrame(animatePlayback);
    } else {
      // Stop playback animation
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      lastTimeRef.current = null;
    }
    
    // Clean up on unmount
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, animatePlayback]);
  
  // Playback controls
  const play = useCallback(() => {
    startPlayback();
  }, [startPlayback]);
  
  const stop = useCallback(() => {
    stopPlayback();
  }, [stopPlayback]);
  
  const pause = useCallback(() => {
    stopPlayback();
  }, [stopPlayback]);
  
  const toggle = useCallback(() => {
    togglePlayback();
  }, [togglePlayback]);
  
  // Jump to specific position
  const jumpToPosition = useCallback((beat: number) => {
    setPlayheadPosition(beat);
  }, [setPlayheadPosition]);
  
  // Format current playhead position as a string (bars:beats)
  const formatPlayheadPosition = useCallback(() => {
    const beatsPerBar = timeSignature.numerator;
    const bar = Math.floor(playheadPosition / beatsPerBar) + 1; // 1-indexed
    const beat = Math.floor(playheadPosition % beatsPerBar) + 1; // 1-indexed
    const remainder = playheadPosition % 1;
    const ticks = Math.floor(remainder * 960); // Assuming 960 ticks per beat
    
    return `${bar.toString().padStart(2, '0')}:${beat.toString().padStart(2, '0')}:${ticks.toString().padStart(3, '0')}`;
  }, [playheadPosition, timeSignature]);
  
  return {
    isPlaying,
    playheadPosition,
    play,
    stop,
    pause,
    toggle,
    jumpToPosition,
    formatPlayheadPosition
  };
};

export default usePlayback;