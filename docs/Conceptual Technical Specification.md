# Sequenced: Conceptual Technical Specification

## Overview
Sequenced is a timeline-based editor for orchestrating AI prompts and generative content. It presents a visual canvas where users can arrange prompts across multiple tracks, with each track typically representing a different AI assistant or output target. The system processes these prompts to generate content such as MIDI data, visualizations, or other outputs, and organizes them in a temporal layout.

## Core Concepts

### Context Aggregation System
The hierarchical context system provides AI assistants with appropriate background information:
- **Inheritance Model**: Context flows downward from project level → track groups → tracks → individual clips
- **Layered Context**: Each level adds more specific information without repeating higher-level context
- **Context Types**:
  - *Global Context*: Project-wide settings and background (style, tone, overall goals)
  - *Group Context*: Shared context for related tracks (character descriptions, scene settings)
  - *Track Context*: Assistant-specific instructions and parameters (voice, behavior, constraints)
  - *Clip Context*: Specific prompts for individual generation tasks
- **Cross-track References**: Ability to reference outputs from other tracks (e.g., "follow the chord progression from the piano track")
- **Temporal Context**: Access to previous outputs in the same track for continuity
- **Context Visualization**: Visual indicators showing which context levels are active for any selected clip
- **Manual Overrides**: Options to selectively ignore higher-level context when needed

### Timeline Canvas
The central interface is a grid-based timeline where:
- The horizontal axis represents time (in bars/beats for music, or other appropriate units)
- The vertical axis contains tracks and track groups
- A timeline ruler at the top shows position markers
- A playhead cursor indicates the current position during playback

### Tracks and Groups
Tracks are horizontal lanes that contain clips:
- Each track represents a different assistant or output destination
- Tracks can be grouped hierarchically
- Groups can be collapsed or expanded to manage complexity
- Color coding helps distinguish different track types
- Track headers on the left contain controls and labels
- Nested context inheritance allows parent groups to provide context to child tracks

### Clips
Clips are the fundamental content containers:
- Represented as rectangular blocks placed on tracks
- Contain prompts or instructions for AI processing
- Display a preview of the contained text (faded if too long)
- Have visual states to show processing status (idle, processing, complete)
- Can be moved, resized, copied, and deleted
- Support clip-specific device chain modifications and parameter overrides
- Can have pre-processing and post-processing devices unique to the clip

### Processing Chain
A modular system for transforming prompts into outputs:
- Appears as a collapsible panel at the bottom of the interface
- Uses a plugin-based architecture for processing clips
- Multiple processing steps can be chained together
- Side-chain inputs can receive data from other tracks
- Parameters can be adjusted for each processing step
- Supports clip-specific overrides of track-level device parameters
- Allows clips to have additional pre/post-processing devices
- Provides visual feedback for modified or overridden processing chains

### Plugin System
An extensible architecture for different generators and processors:
- Plugins define how prompts are processed
- First-party plugins provide core functionality (MIDI generation, visualization, etc.)
- Community plugins can be shared via GitHub integration
- Plugins can define both processing logic and UI components

## Key Features

### Timeline Editing
- Create and edit tracks in a visual interface
- Add and edit prompt clips with text content
- Basic playback functionality with transport controls
- Select, move, and resize clips
- Zoom and scroll along the timeline

### Prompt Processing
- Enter text prompts within clips
- Process prompts through configurable chains
- Receive status updates during processing
- View and interact with generated outputs

### MIDI Output
- Generate MIDI data from natural language prompts
- Route MIDI to virtual or hardware devices
- Control musical parameters through prompts
- Playback generated music in sync with the timeline

### Hierarchical Organization
- Create nested groups of tracks
- Collapse or expand groups to manage workspace
- Inherit context from groups to individual tracks
- Organize projects with logical grouping

### Ripple Editing
- Insert or delete content with automatic adjustment of subsequent clips
- Toggle between ripple and standard editing modes
- Apply ripple edits to specific tracks or globally
- Maintain temporal relationships when making changes

### Clip-Specific Processing
- Override track-level device parameters for individual clips
- Add pre-processing devices applied before the track chain
- Add post-processing devices applied after the track chain
- Selectively enable/disable track devices for specific clips
- Reorder the processing chain for individual clips
- Save and reuse clip-specific device configurations

### Dependencies Between Tracks
- Connect clips across different tracks
- Use output from one track as input to another
- Create complex workflows with sequential processing
- Visualize dependencies with connection indicators

### Context Management
- Dedicated interface for editing context at each level
- Context templates for common scenarios
- Dynamic preview of aggregated context for any selected clip
- Context inheritance toggles to enable/disable specific levels
- Automatic detection of potential context conflicts
- Syntax for referencing specific parts of other track outputs
- Optimization to prevent context overload (summarization options for long contexts)
- Version history for context edits

### GitHub Integration
- Share plugins through GitHub repositories
- Distribute templates and clip libraries
- Enable version control for projects
- Foster community development

## User Experience

### Device Targets
- Primary focus on tablet devices in landscape orientation
- Primary support for desktop browsers
- Limited but functional experience on phones
- Responsive design that adapts to different screen sizes

### Interface Elements
- Touch-optimized controls with appropriate sizing
- Consistent color coding for different track types
- Visual feedback for actions and states
- Minimal animations focused on functional elements (playhead, status changes)
- Collapsible panels to maximize timeline space

### Workflow Optimization
- Ripple editing for rapid content manipulation
- Track templates for common setups
- Clip libraries for reusable prompts
- Context inheritance to reduce repetition

## Development Roadmap

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

### Phase 3: Community Features
- GitHub integration
- Template and clip sharing
- Enhanced collaboration features
- Additional first-party plugins

## Technical Approach
- Web-based application using React (with potential migration to SolidJS)
- HTML-based UI components with minimal Canvas elements
- Responsive design principles for cross-device compatibility
- Backend processing for computationally intensive tasks
- Web MIDI API for music device integration

## First-Party Plugins

### MIDI Generator
- Creates musical content from text prompts
- Supports different musical styles and approaches
- Outputs standard MIDI data
- Parameters for tempo, key, complexity, etc.

### Visualization Renderer
- Generates visuals based on prompts or audio
- Creates animations that sync with timeline
- Supports different visual styles
- Parameters for colors, complexity, motion, etc.

### Project Task Processor
- Converts high-level project descriptions into tasks
- Organizes tasks across timeline
- Supports dependencies and resources
- Integration with project management concepts

### AI Service Connectors
- Interface with different AI models (Claude, GPT, etc.)
- Optimize prompts for specific services
- Handle authentication and API communication
- Normalize outputs across different models