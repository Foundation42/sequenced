# Sequenced

Sequenced is a timeline-based editor for orchestrating AI prompts and generative content. It allows users to visually arrange prompts across multiple tracks, with each track representing a different AI assistant or output target.

## Features

- Timeline-based visual interface for arranging AI prompts
- Hierarchical context system for efficient prompt management
- Track and group organization for complex projects
- Device-based processing chain for transforming prompts into outputs
- Support for MIDI, visualization, and other output formats
- Plugin architecture for extensibility

## Development Status

Sequenced is currently in early development. Check out our [ROADMAP](docs/ROADMAP.md) for the development plan and [TODO](TODO.md) list for current tasks.

![Current Status: Phase 1 - Timeline UI](https://img.shields.io/badge/Status-Phase%201%20Timeline%20UI-blue)

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

## Contributing

Contributions are welcome! Please read our [CONTRIBUTING](.github/CONTRIBUTING.md) guidelines before submitting a pull request.

## Documentation

- [Conceptual Technical Specification](docs/Conceptual%20Technical%20Specification.md)
- [Implementation Guide](docs/Implementation%20Guide.md)
- [Sequenced Overview](docs/Sequenced%20Overview.md)
- [Development Roadmap](docs/ROADMAP.md)
- [Todo List](TODO.md)

## License

[MIT License](LICENSE)