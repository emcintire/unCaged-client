# unCaged - Nicolas Cage Movie App

The best app to find, rate, and bookmark all of Nicolas Cage's cinematic masterpieces.

With unCaged you can discover new Nicolas Cage films based on genre, mark them as seen, add them to your favorites, rate the movies, and also add them to your watchlist. If you're feeling frisky, there is also a random Nic Cage movie generator.

## Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript (strict mode)
- **Navigation**: React Navigation
- **State Management**: TanStack Query (React Query)
- **API Client**: Zodios with Axios
- **Forms**: Formik with Yup validation
- **Styling**: StyleSheet with custom theme system
- **Ads**: Google Mobile Ads

## Code Standards

### TypeScript

- Strict mode enabled
- Explicit return types for functions
- No implicit `any`
- Comprehensive type definitions

### Code Style

- ESLint for code quality
- Prettier for code formatting
- Consistent naming conventions:
  - PascalCase for components
  - camelCase for functions and variables
  - UPPER_SNAKE_CASE for constants

## API Integration

The app uses Zodios for type-safe API calls with automatic validation:

```typescript
// Example usage
const { data, isLoading, error } = useMovies();
```

All API endpoints are defined in `app/api/controllers/` with:
- Type-safe request/response schemas
- Automatic validation with Zod
- React Query integration
- Error handling

## Architecture Decisions

### Why TanStack Query?

- Automatic caching and background refetching
- Optimistic updates support
- Built-in loading and error states
- Powerful dev tools

### Why Zodios?

- Type-safe API calls
- Runtime validation
- OpenAPI compatibility
- Excellent TypeScript support

### Why Formik + Yup?

- Declarative form handling
- Built-in validation
- Easy error handling
- Good React Native support

## Performance Optimization

- Code splitting by screen
- Image optimization
- Lazy loading for heavy components
- Debounced search inputs
- Memoized components and callbacks