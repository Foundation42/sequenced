# CLAUDE.md - Sequenced Project Guidelines

## Build & Run Commands
- Install: `bun install`
- Run dev server: `bun run dev`
- Build: `bun run build`
- Preview build: `bun run preview`
- Lint: `bun run lint`
- Type check: `bun run typecheck`

## Code Style Guidelines
- **TypeScript**: Strict mode enabled with ESNext target
- **Modules**: ESM format only (no CommonJS)
- **Formatting**: 2-space indentation, 100-char line limit
- **Imports**: Group by 1) core, 2) external, 3) internal
- **Components**: React with functional components, hooks
- **Naming**:
  - camelCase for variables/functions
  - PascalCase for components/classes/types
  - UPPER_CASE for constants
- **Error handling**: Use Result/Option pattern for error states
- **Types**: Prefer explicit typing, minimize `any` usage
- **State management**: Use Zustand for global state

## Project Info
- Timeline-based editor for AI prompt orchestration
- Web-based with React (future transition to SolidJS)
- Focus on tablet/desktop experience
- Plugin-based architecture for content generation