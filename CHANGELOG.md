# Changelog

## [Unreleased]

### Added
- Initial project setup with React, TypeScript, and Vite
- Basic component structure for the timeline editor UI
- Timeline components (tracks, clips, playhead)
- Transport controls and timecode display
- Device panel and processing chain components
- Context editor components
- Global and component-specific styling
- Type definitions for core concepts (tracks, clips, devices)
- Utility functions for time calculations
- MIDI service for interfacing with MIDI devices
- Basic state management with hooks and Zustand
- Project documentation (README.md, CLAUDE.md)

### Implemented
- Timeline functionality with tracks and clips
- Zustand store for managing timeline state
- Playback controls and playhead movement
- Drag-and-drop for clips
- Resize functionality for clips
- Track and clip selection
- Time ruler with adaptive ticks based on zoom level
- Dynamic clip creation and editing
- Sample data initialization

### Fixed
- TypeScript configuration to include DOM types
- Added proper type imports for state management
- Updated Bun entry point configuration
- Fixed type safety issues in context components
- Added null/undefined checks in clip interactions
- Added proper MIDI type definitions for Web MIDI API
- Fixed type safety in MIDI service implementation