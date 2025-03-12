# Contributing to Sequenced

First off, thank you for considering contributing to Sequenced! It's people like you that make Sequenced such a great tool.

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

### Pull Requests

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Follow the existing code style and structure
- Use TypeScript for all new code
- Add proper JSDoc comments to functions and components
- Follow the React hooks pattern for component state management
- Use the existing state management pattern with Zustand stores

### Development Environment

- Use Visual Studio Code with ESLint and Prettier
- Make sure your code passes the linting rules (`bun run lint`)
- Ensure TypeScript checks pass (`bun run typecheck`)

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

## Component Guidelines

### New Components

When creating new components:

1. Create them in the appropriate subdirectory
2. Use TypeScript interfaces for props
3. Use functional components with hooks
4. Connect to state using the appropriate store hooks
5. Add proper JSDoc comments
6. Add appropriate CSS styles in the relevant CSS file

### State Management

- Use the Zustand store pattern for global state
- Keep component state local when appropriate
- Use custom hooks to encapsulate complex state logic

## Plugin Development

For plugin development:

1. Follow the plugin architecture documentation
2. Create a separate directory in `src/plugins/`
3. Implement the required interfaces
4. Add proper documentation

## Testing

- Add unit tests for utility functions
- Add component tests for React components
- Consider adding integration tests for complex features

## Documentation

- Update the README.md if you change required dependencies or build tools
- Add appropriate JSDoc comments to all new functions and components
- Update the relevant documentation in `docs/` directory

## License

By contributing, you agree that your contributions will be licensed under the project's license.

## Questions?

If you have any questions or need help, please open an issue in the repository.