/**
 * Converts time in seconds to a musical time format (bars:beats:ticks)
 * @param timeInSeconds The time in seconds
 * @param tempo The tempo in BPM
 * @param timeSignature The time signature numerator (beats per bar)
 * @param ticksPerBeat The number of ticks per beat
 * @returns An object containing bars, beats, and ticks
 */
export const secondsToMusicalTime = (
  timeInSeconds: number, 
  tempo: number = 120, 
  timeSignature: number = 4,
  ticksPerBeat: number = 960
): { bars: number; beats: number; ticks: number } => {
  // Calculate total beats
  const secondsPerBeat = 60 / tempo;
  const totalBeats = timeInSeconds / secondsPerBeat;
  
  // Calculate bars and remaining beats
  const bars = Math.floor(totalBeats / timeSignature) + 1; // 1-indexed
  const remainingBeats = totalBeats % timeSignature;
  
  // Calculate beats and ticks
  const beats = Math.floor(remainingBeats) + 1; // 1-indexed
  const remainingBeatFraction = remainingBeats - Math.floor(remainingBeats);
  const ticks = Math.round(remainingBeatFraction * ticksPerBeat);
  
  return { bars, beats, ticks };
};

/**
 * Converts musical time to seconds
 * @param bars The bar number (1-indexed)
 * @param beats The beat number (1-indexed)
 * @param ticks The tick number
 * @param tempo The tempo in BPM
 * @param timeSignature The time signature numerator (beats per bar)
 * @param ticksPerBeat The number of ticks per beat
 * @returns The time in seconds
 */
export const musicalTimeToSeconds = (
  bars: number, 
  beats: number, 
  ticks: number, 
  tempo: number = 120, 
  timeSignature: number = 4,
  ticksPerBeat: number = 960
): number => {
  const secondsPerBeat = 60 / tempo;
  
  // Convert to 0-indexed
  const barsZeroIndexed = bars - 1;
  const beatsZeroIndexed = beats - 1;
  
  // Calculate total beats
  const totalBeats = (barsZeroIndexed * timeSignature) + beatsZeroIndexed + (ticks / ticksPerBeat);
  
  // Convert to seconds
  return totalBeats * secondsPerBeat;
};

/**
 * Formats musical time as a display string
 * @param musicalTime The musical time object
 * @returns A formatted string representation
 */
export const formatMusicalTime = (
  musicalTime: { bars: number; beats: number; ticks: number }
): string => {
  const { bars, beats, ticks } = musicalTime;
  return `${bars.toString().padStart(2, '0')}:${beats.toString().padStart(2, '0')}:${ticks.toString().padStart(3, '0')}`;
};

/**
 * Converts pixels to time units based on zoom level
 * @param pixels The pixel value
 * @param pixelsPerBeat The number of pixels per beat at zoom level 1
 * @param zoom The current zoom level
 * @returns The time value in beats
 */
export const pixelsToBeats = (
  pixels: number, 
  pixelsPerBeat: number = 100,
  zoom: number = 1
): number => {
  return pixels / (pixelsPerBeat * zoom);
};

/**
 * Converts time units to pixels based on zoom level
 * @param beats The time value in beats
 * @param pixelsPerBeat The number of pixels per beat at zoom level 1
 * @param zoom The current zoom level
 * @returns The pixel value
 */
export const beatsToPixels = (
  beats: number, 
  pixelsPerBeat: number = 100,
  zoom: number = 1
): number => {
  return beats * pixelsPerBeat * zoom;
};