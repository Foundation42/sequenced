# Sequenced: Timeline-Based AI Orchestration Tool Specification

## Overview
Sequenced is a timeline-based editor for orchestrating AI prompts and generative content. It allows users to visually arrange prompts across tracks, with each track representing a different AI assistant or output target. The system processes these prompts to generate content (MIDI, visualizations, text, etc.) and presents the results in a temporal layout.

## Core Concepts

### Timeline Canvas
- Horizontal axis represents time (bars/beats for music, or other time units)
- Vertical axis contains tracks and track groups
- Grid-based layout with snap functionality
- Timeline ruler at top showing position/time indicators

### Tracks & Groups
- Each track represents a different assistant or output destination
- Tracks can be grouped hierarchically
- Groups can be collapsed/expanded
- Color coding for different track types
- Nested context inheritance from parent groups to child tracks

### Clips
- Rectangular blocks placed on tracks
- Contain prompts/instructions for AI processing
- Display preview of contained text (faded if too long)
- Visual states to show processing status (idle, processing, complete)
- Can be moved, resized, copied, deleted

### Processing Chain
- Collapsible panel at bottom of interface
- Plugin-based system for clip processing
- Multiple processing steps can be chained together
- Side-chain inputs can receive data from other tracks

### Plugin System
- Extensible architecture for different generators and processors
- First-party plugins for MIDI generation, visualization, etc.
- Community plugins via GitHub repository integration
- Plugins can define both processing logic and UI components

## Technical Requirements

### Core Platform
- Web-based application using React (transitioning to SolidJS later)
- Responsive design focusing on tablet experience, with phone support
- HTML-based UI components with minimal Canvas elements
- Backend system for heavy processing tasks

### Essential Components

#### App Structure
- `TimelineEditor` - Main container
- `Header` - App controls, file operations
- `TransportControls` - Playback controls
- `TimecodeDisplay` - Current position indicator

#### Timeline Components
- `Timeline` - Container for tracks and time ruler
- `TimeRuler` - Displays time measurements
- `PlayheadCursor` - Shows current position
- `TrackList` - Container for tracks
- `TrackGroup` - Collapsible group
- `Track` - Individual track
- `TrackHeader` - Left panel with controls

#### Clip Components
- `Clip` - Container for prompt
- `ClipContent` - Text editor for prompt
- `ClipStatusIndicator` - Processing state

#### Device Chain Components
- `DeviceChainPanel` - Bottom panel
- `DeviceChain` - Series of processors
- `Device` - Individual processor
- `DeviceControls` - Parameters

#### Utility Components
- `ContextMenu` - Right-click options
- `Modal` - Dialogs
- `Tooltip` - Quick help

## Key Features

### Primary Features (Phase 1)
1. **Timeline Editing**
   - Create/edit tracks
   - Add/edit prompt clips
   - Basic playback functionality
   - Clip selection, moving, resizing

2. **Prompt Processing**
   - Text input within clips
   - Basic processing to generate outputs
   - Status indication during processing

3. **MIDI Output**
   - Generate MIDI data from prompts
   - Route to virtual or hardware MIDI devices
   - Basic playback of generated MIDI

4. **Hierarchical Track Groups**
   - Create nested groups of tracks
   - Collapse/expand groups
   - Context inheritance from groups to tracks

5. **Ripple Editing**
   - Insert/delete content with automatic adjustment
   - Toggle between ripple and standard editing modes
   - Track-specific or global ripple options

### Secondary Features (Phase 2)
1. **Side-Chain/Dependencies**
   - Connect clips between tracks
   - Use output from one track as input to another
   - Visual indicators of dependencies

2. **Device Chains**
   - Multiple processing stages per clip
   - Parameter controls for processing
   - Preset management for chains

3. **Github Integration**
   - Plugin distribution via GitHub
   - Share templates and clip libraries
   - Project version control

4. **Multi-Output Generation**
   - Generate multiple types of content from single prompt
   - Visualization alongside MIDI
   - Text output with audio/visual elements

## Plugin Architecture
Plugins will follow a modular structure:
- Manifest file defining capabilities and requirements
- Processing logic for generating content
- UI components for parameter control
- Input/output specifications

### First-Party Plugins
1. MIDI Generator - Create musical content
2. Visualization Renderer - Generate visuals 
3. Project Task Processor - For workflow management
4. Multiple AI Service Connectors (Claude, GPT, etc.)

## User Experience
- Primary focus on tablets (landscape orientation)
- Primary support for desktop browsers
- Limited but functional phone experience
- Touch-optimized interface with appropriate sizing
- Consistent color coding and visual feedback
- Minimal animations (playhead, status changes)

## Development Phases

### Phase 1: Core Framework
- Basic timeline and track implementation
- Simple clip editing and playback
- Fundamental MIDI output functionality
- Essential UI components

### Phase 2: Processing System
- Plugin architecture implementation
- Device chain processing
- Side-chain/dependency system
- First-party plugins

### Phase 3: Community & Sharing
- GitHub integration
- Template sharing
- Enhanced collaboration features
- Additional first-party plugins

## Technical Implementation Notes
- Use React for initial development
- Consider migration to SolidJS for performance
- Implement Web MIDI API for MIDI output
- Design plugin API for extensibility from the start
- Focus on responsive layout that works across devices
- Keep processing modular and extensible