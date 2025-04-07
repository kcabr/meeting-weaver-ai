# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands
- Dev server: `npm run dev`
- Build: `npm run build`
- Start production: `npm run start`

## Code Style Guidelines
- **TypeScript**: Use strict mode, prefer interfaces over types, avoid enums
- **Components**: PascalCase naming, organize in `/components` (shared) or `/_components` (route-specific)
- **Hooks**: Encapsulate state/logic in custom hooks to keep components clean
- **Naming**: camelCase for variables/functions, lowercase-dashes for directories
- **Functions**: Use function keyword for pure functions, avoid classes
- **UI**: Use Tailwind/shadcn for styling, DO NOT edit shadcn component files directly
- **JSX**: Use semantic HTML tags, separate main component parts with blank lines
- **Patterns**: Favor immutability, modularity, and descriptive naming with auxiliary verbs (isLoading, hasError)
- **Error handling**: Use try/catch with consistent user feedback and console logging

## Redux Store
- Use RTK slices for state management
- Follow existing patterns in /store/slices

## File Organization
- Route-based components in `/_components`
- Shared components in `/components`
- Forms in `/components/forms`
- Hooks in `/hooks`
- Utils in `/utils`