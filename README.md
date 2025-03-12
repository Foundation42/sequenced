# Sequenced

Sequenced is a timeline-based editor for orchestrating AI prompts and generative content. It allows users to visually arrange prompts across multiple tracks, with each track representing a different AI assistant or output target.

## Features

- Timeline-based visual interface for arranging AI prompts
- Hierarchical context system for efficient prompt management
- Track and group organization for complex projects
- Device-based processing chain for transforming prompts into outputs
- Support for MIDI, visualization, and other output formats
- Plugin architecture for extensibility

## Development

### Prerequisites

- Node.js (v16+)
- npm or bun

### Setup

```bash
# Install dependencies
bun install

# Start the development server
bun run dev

# Build for production
bun run build

# Run linting
bun run lint

# Type checking
bun run typecheck
```

## Project Structure

```
sequenced/
├── public/            # Static assets
├── src/
│   ├── components/    # React components
│   │   ├── layout/    # Layout components
│   │   ├── timeline/  # Timeline components
│   │   ├── clips/     # Clip components
│   │   ├── transport/ # Transport controls
│   │   ├── devices/   # Device components
│   │   ├── context/   # Context system components
│   │   └── common/    # Common UI components
│   ├── hooks/         # Custom React hooks
│   ├── store/         # State management
│   ├── services/      # External services
│   ├── plugins/       # Plugin system
│   ├── utils/         # Utility functions
│   └── styles/        # CSS styles
└── docs/              # Documentation
```

## License

[MIT License](LICENSE)