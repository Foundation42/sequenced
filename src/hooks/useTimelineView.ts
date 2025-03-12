import { useState, useCallback, useRef, useEffect } from 'react';

interface TimelineViewState {
  zoom: number;
  horizontalScroll: number;
  verticalScroll: number;
  pixelsPerBeat: number;
  viewportWidth: number;
  viewportHeight: number;
  contentWidth: number;
  contentHeight: number;
  isScrolling: boolean;
}

/**
 * Hook for managing timeline view state (zoom, scroll, etc.)
 */
const useTimelineView = (initialBeats: number = 64, initialTracks: number = 8) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<TimelineViewState>({
    zoom: 1,
    horizontalScroll: 0,
    verticalScroll: 0,
    pixelsPerBeat: 100, // Default pixels per beat at zoom level 1
    viewportWidth: 0,
    viewportHeight: 0,
    contentWidth: initialBeats * 100, // Initial content width (beats * pixelsPerBeat)
    contentHeight: initialTracks * 80, // Initial content height (tracks * trackHeight)
    isScrolling: false,
  });

  // Update viewport dimensions when container size changes
  useEffect(() => {
    if (!containerRef.current) return;

    const updateViewportDimensions = () => {
      const container = containerRef.current;
      if (!container) return;
      
      setState(prev => ({
        ...prev,
        viewportWidth: container.clientWidth,
        viewportHeight: container.clientHeight
      }));
    };

    // Initial measurement
    updateViewportDimensions();

    // Set up resize observer
    const resizeObserver = new ResizeObserver(updateViewportDimensions);
    resizeObserver.observe(containerRef.current);

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, []);

  // Update content dimensions based on timeline data
  const updateContentDimensions = useCallback((beats: number, trackCount: number) => {
    setState(prev => ({
      ...prev,
      contentWidth: beats * prev.pixelsPerBeat * prev.zoom,
      contentHeight: trackCount * 80 // 80px is the track height
    }));
  }, []);

  // Zoom to a specific level
  const setZoom = useCallback((newZoom: number) => {
    setState(prev => {
      // Limit zoom level between 0.1 and 5
      const clampedZoom = Math.max(0.1, Math.min(5, newZoom));
      
      // Calculate new content width
      const newContentWidth = (prev.contentWidth / prev.zoom) * clampedZoom;
      
      return {
        ...prev,
        zoom: clampedZoom,
        contentWidth: newContentWidth
      };
    });
  }, []);

  // Zoom in/out centered on a specific point
  const zoomAt = useCallback((deltaZoom: number, centerX: number) => {
    setState(prev => {
      // Calculate position percentage in the content
      const scrollContainer = containerRef.current;
      if (!scrollContainer) return prev;
      
      const containerRect = scrollContainer.getBoundingClientRect();
      const scrollLeft = scrollContainer.scrollLeft;
      
      // Where in the content we're zooming (in pixels)
      const zoomPointX = centerX - containerRect.left + scrollLeft;
      
      // What percentage of the content width is that
      const zoomPercentX = zoomPointX / prev.contentWidth;
      
      // Calculate new zoom level
      const newZoom = Math.max(0.1, Math.min(5, prev.zoom + deltaZoom));
      
      // Calculate new content width
      const baseWidth = prev.contentWidth / prev.zoom;
      const newContentWidth = baseWidth * newZoom;
      
      // Calculate new scroll position to keep the zoom point at the same position
      const newScrollLeft = (newContentWidth * zoomPercentX) - (centerX - containerRect.left);
      
      // Update scroll position
      if (scrollContainer) {
        scrollContainer.scrollLeft = newScrollLeft;
      }
      
      return {
        ...prev,
        zoom: newZoom,
        contentWidth: newContentWidth,
        horizontalScroll: newScrollLeft
      };
    });
  }, []);

  // Scroll to a specific position
  const scrollTo = useCallback((x: number, y: number) => {
    if (containerRef.current) {
      containerRef.current.scrollLeft = x;
      containerRef.current.scrollTop = y;
    }
    
    setState(prev => ({
      ...prev,
      horizontalScroll: x,
      verticalScroll: y
    }));
  }, []);

  // Scroll to a specific beat position
  const scrollToBeat = useCallback((beat: number) => {
    const pixelPosition = beat * state.pixelsPerBeat * state.zoom;
    scrollTo(pixelPosition, state.verticalScroll);
  }, [state.pixelsPerBeat, state.zoom, state.verticalScroll, scrollTo]);

  // Handle scroll events
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    setState(prev => ({
      ...prev,
      horizontalScroll: target.scrollLeft,
      verticalScroll: target.scrollTop,
      isScrolling: true
    }));
    
    // Clear scrolling flag after a delay
    clearTimeout((handleScroll as any).scrollTimeout);
    (handleScroll as any).scrollTimeout = setTimeout(() => {
      setState(prev => ({
        ...prev,
        isScrolling: false
      }));
    }, 150);
  }, []);

  // Handle wheel events for zooming
  const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    // Zoom with Ctrl+Wheel
    if (e.ctrlKey) {
      e.preventDefault();
      const deltaZoom = e.deltaY > 0 ? -0.1 : 0.1;
      zoomAt(deltaZoom, e.clientX);
    }
  }, [zoomAt]);

  // Convert beat position to pixel position
  const beatToPixel = useCallback((beat: number) => {
    return beat * state.pixelsPerBeat * state.zoom;
  }, [state.pixelsPerBeat, state.zoom]);

  // Convert pixel position to beat position
  const pixelToBeat = useCallback((pixel: number) => {
    return pixel / (state.pixelsPerBeat * state.zoom);
  }, [state.pixelsPerBeat, state.zoom]);

  return {
    containerRef,
    state,
    setZoom,
    zoomAt,
    scrollTo,
    scrollToBeat,
    handleScroll,
    handleWheel,
    updateContentDimensions,
    beatToPixel,
    pixelToBeat
  };
};

export default useTimelineView;