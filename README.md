# unCaged - Nicolas Cage Movie App

The best app to find, rate, and bookmark all of Nicolas Cage's cinematic masterpieces.

With unCaged you can discover new Nicolas Cage films based on genre, mark them as seen, add them to your favorites, rate the movies, and also add them to your watchlist. If you're feeling frisky, there is also a random Nic Cage movie generator.

## Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript (strict mode)
- **Navigation**: React Navigation v6
- **State Management**: TanStack Query (React Query) v5
- **API Client**: Zodios with Axios
- **Forms**: Formik with Yup validation
- **Styling**: StyleSheet with custom theme system
- **Fonts**: Custom Montserrat font family
- **Ads**: Google Mobile Ads

## Project Structure

```
app/
├── api/              # API layer
│   ├── controllers/  # API endpoint definitions and hooks
│   ├── schemas/      # Zod validation schemas
│   ├── hooks.ts      # React Query utility hooks
│   ├── queryClient.ts
│   └── zodiosClient.ts
├── assets/          # Static assets (fonts, images)
├── components/      # Reusable UI components
│   ├── forms/       # Form-related components
│   └── movieModal/  # Movie detail modal components
├── config/          # App configuration
│   ├── colors.ts    # Color palette
│   ├── env.ts       # Environment variables
│   ├── theme.ts     # Shared styles and theme
│   ├── helperFunctions.ts
│   └── toastConfig.tsx
├── constants/       # App constants
├── hooks/          # Custom React hooks
├── screens/        # Screen components
│   ├── Home/       # Main app screens
│   └── Welcome/    # Authentication screens
├── stacks/         # Navigation stacks
│   └── Home/       # Home navigation configuration
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
    ├── logger.ts      # Logging utility
    ├── validation.ts  # Input validation
    └── performance.ts # Performance utilities
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Emulator

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

### Environment Configuration

Create a `.env` file in the root directory:

```env
API_BASE_URL=https://your-api-url.com/api
```

## Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run web` - Run on web
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run type-check` - Run TypeScript type checking
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report

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

### Component Guidelines

1. **Functional Components**: Use function declarations, not arrow functions
2. **Hooks**: Follow React Hooks rules
3. **Props**: Always define TypeScript types for props
4. **Styling**: Use theme constants for consistent styling
5. **Error Handling**: Use try-catch with proper error logging

### Best Practices

1. **State Management**
   - Use TanStack Query for server state
   - Use React hooks for local state
   - Implement optimistic updates where appropriate

2. **Performance**
   - Memoize expensive computations with `useMemo`
   - Memoize callbacks with `useCallback`
   - Use `React.memo` for expensive components
   - Implement list virtualization for long lists

3. **Error Handling**
   - Catch and log errors appropriately
   - Show user-friendly error messages
   - Use error boundaries for component errors

4. **Security**
   - Sanitize user inputs
   - Store sensitive data in secure storage
   - Validate all API responses

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

## Testing

Testing infrastructure is set up with Jest and React Native Testing Library:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Environment Variables

Configure the following in `app.config.js`:

- `API_BASE_URL`: Backend API base URL

## Contributing

1. Follow the existing code structure
2. Write TypeScript with proper types
3. Add tests for new features
4. Run linting and type checking before committing
5. Follow commit message conventions

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

## Documentation

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture documentation and implementation guide.

## License

Private project

## Support

For issues and questions, please contact the development team.
