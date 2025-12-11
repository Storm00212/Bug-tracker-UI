# Redux State Management Architecture

This document provides a comprehensive overview of the Redux state management system implemented in the Bug Tracker application using Redux Toolkit.

## Table of Contents

- [Overview](#overview)
- [Store Configuration](#store-configuration)
- [Slice Architecture](#slice-architecture)
- [State Structure](#state-structure)
- [Async Thunks](#async-thunks)
- [Selectors and Hooks](#selectors-and-hooks)
- [Error Handling](#error-handling)
- [Best Practices](#best-practices)

## Overview

The application uses Redux Toolkit for state management, providing a predictable and scalable way to manage application state. The store is organized into feature-based slices, each handling a specific domain of the application.

### Key Benefits

- **Predictable State Updates**: Actions describe what happened, reducers specify how state changes
- **Centralized State**: Single source of truth for application state
- **Time Travel Debugging**: Redux DevTools support for debugging
- **Type Safety**: Full TypeScript integration with typed actions and state
- **Performance**: Optimized with memoized selectors and efficient updates

## Store Configuration

### Root Store (`store/index.ts`)

```typescript
export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectsReducer,
    bugs: bugsReducer,
    comments: commentsReducer,
    users: usersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

The store combines all feature slices into a single root reducer. TypeScript types are exported for type-safe usage throughout the application.

### Provider Setup (`index.tsx`)

```typescript
<Provider store={store}>
  <App />
</Provider>
```

The Redux Provider wraps the entire application, making the store available to all components.

## Slice Architecture

Each slice follows the Redux Toolkit pattern with a consistent structure:

### Slice Structure

```typescript
interface SliceState {
  // Domain-specific state properties
  isLoading: boolean;
  error: string | null;
  // ... other properties
}

const initialState: SliceState = {
  // Initial values
};

const slice = createSlice({
  name: 'sliceName',
  initialState,
  reducers: {
    // Synchronous actions
  },
  extraReducers: (builder) => {
    // Async action handlers
  },
});
```

### Available Slices

#### 1. Auth Slice (`store/slices/authSlice.ts`)

**Purpose**: Manages user authentication state and session management.

**State Structure**:
```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}
```

**Actions**:
- `login` - Async thunk for user authentication
- `register` - Async thunk for user registration
- `getProfile` - Async thunk for fetching user profile
- `logout` - Synchronous action to clear session
- `clearError` - Synchronous action to clear error state

**Usage**:
```typescript
const { user, isLoading, error } = useAppSelector(state => state.auth);
const dispatch = useAppDispatch();

dispatch(login({ email, password }));
```

#### 2. Projects Slice (`store/slices/projectsSlice.ts`)

**Purpose**: Manages project-related state and operations.

**State Structure**:
```typescript
interface ProjectsState {
  projects: Project[];
  selectedProject: Project | null;
  isLoading: boolean;
  error: string | null;
}
```

**Actions**:
- `fetchProjects` - Async thunk to load all user projects
- `createProject` - Async thunk to create new project
- `updateProject` - Async thunk to update existing project
- `deleteProject` - Async thunk to delete project
- `selectProject` - Synchronous action to set active project

#### 3. Bugs Slice (`store/slices/bugsSlice.ts`)

**Purpose**: Manages bug/issue-related state and operations.

**State Structure**:
```typescript
interface BugsState {
  bugs: Bug[];
  isLoading: boolean;
  error: string | null;
}
```

**Actions**:
- `fetchBugsByProject` - Async thunk to load bugs for selected project
- `createBug` - Async thunk to create new bug
- `updateBug` - Async thunk to update existing bug
- `deleteBug` - Async thunk to delete bug

#### 4. Users Slice (`store/slices/usersSlice.ts`)

**Purpose**: Manages user-related data for project collaboration.

**State Structure**:
```typescript
interface UsersState {
  users: User[];
  isLoading: boolean;
  error: string | null;
}
```

**Actions**:
- `fetchUsersByProject` - Async thunk to load users for selected project

#### 5. Comments Slice (`store/slices/commentsSlice.ts`)

**Purpose**: Manages bug comments and discussion threads.

**State Structure**:
```typescript
interface CommentsState {
  comments: Comment[];
  isLoading: boolean;
  error: string | null;
}
```

**Actions**:
- `fetchCommentsByBug` - Async thunk to load comments for specific bug
- `createComment` - Async thunk to add new comment
- `updateComment` - Async thunk to edit comment
- `deleteComment` - Async thunk to remove comment

## State Structure

### Root State Type

```typescript
interface RootState {
  auth: AuthState;
  projects: ProjectsState;
  bugs: BugsState;
  comments: CommentsState;
  users: UsersState;
}
```

### State Flow

1. **Component dispatches action** → Redux Toolkit async thunk
2. **Thunk calls API service** → Backend API request
3. **Thunk receives response** → Dispatches fulfilled/rejected action
4. **Slice reducer updates state** → Components re-render with new state
5. **Components access state** → Via useAppSelector hook

## Async Thunks

Async thunks handle API calls and follow a consistent pattern:

### Thunk Structure

```typescript
export const exampleThunk = createAsyncThunk(
  'sliceName/actionName',
  async (params, { rejectWithValue }) => {
    try {
      const response = await apiService.call(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error message');
    }
  }
);
```

### Thunk Lifecycle

1. **Pending**: Sets `isLoading: true`, clears errors
2. **Fulfilled**: Updates state with response data, sets `isLoading: false`
3. **Rejected**: Sets error message, sets `isLoading: false`

## Selectors and Hooks

### Typed Hooks

```typescript
// store/hooks.ts
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './index';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

### Usage in Components

```typescript
import { useAppSelector, useAppDispatch } from '../store/hooks';

const MyComponent = () => {
  const dispatch = useAppDispatch();

  // Select specific state slices
  const { user, isLoading } = useAppSelector(state => state.auth);
  const { projects, selectedProject } = useAppSelector(state => state.projects);

  // Select computed values
  const activeProjectBugs = useAppSelector(state =>
    state.bugs.bugs.filter(bug => bug.ProjectID === state.projects.selectedProject?.ProjectID)
  );

  return (
    // Component JSX
  );
};
```

## Error Handling

### Error State Management

Each slice includes error handling:

```typescript
interface SliceState {
  isLoading: boolean;
  error: string | null;
  // ... other properties
}
```

### Error Flow

1. **Thunk catches error** → Returns `rejectWithValue(errorMessage)`
2. **Rejected action dispatched** → Reducer sets `error` state
3. **Component displays error** → Via `error` state in selector
4. **User clears error** → Dispatches `clearError` action

### Error Display

```typescript
const { error } = useAppSelector(state => state.auth);

{error && (
  <div className="error-message">
    {error}
  </div>
)}
```

## Best Practices

### 1. Action Naming

- Use descriptive names: `fetchProjects`, `createBug`, `updateUser`
- Follow pattern: `verbNoun` (fetchProjects, createProject, updateBug)

### 2. State Normalization

- Keep state flat and normalized
- Use IDs as keys for efficient lookups
- Avoid nested state structures

### 3. Selector Memoization

```typescript
// Good: Memoized selector
const selectActiveProjectBugs = createSelector(
  [(state: RootState) => state.bugs.bugs, (state: RootState) => state.projects.selectedProject],
  (bugs, selectedProject) => bugs.filter(bug => bug.ProjectID === selectedProject?.ProjectID)
);
```

### 4. Async Thunk Error Handling

```typescript
// Consistent error handling pattern
try {
  const response = await api.call(params);
  return response.data;
} catch (error: any) {
  return rejectWithValue(error.response?.data?.message || 'Default error message');
}
```

### 5. Type Safety

- Define interfaces for all state shapes
- Use TypeScript generics with async thunks
- Export action types for component usage

### 6. Component Integration

```typescript
// Good: Separate logic from presentation
const MyComponent = () => {
  const dispatch = useAppDispatch();
  const { data, isLoading, error } = useAppSelector(state => state.mySlice);

  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return <DataDisplay data={data} />;
};
```

## Common Patterns

### Loading States

```typescript
const { isLoading } = useAppSelector(state => state.sliceName);

{isLoading && <Spinner />}
```

### Conditional Rendering

```typescript
const { user } = useAppSelector(state => state.auth);

{user ? <Dashboard /> : <LoginForm />}
```

### Optimistic Updates

```typescript
const handleDelete = async (id: number) => {
  // Optimistically remove from UI
  dispatch(removeItem(id));

  try {
    await dispatch(deleteItem(id)).unwrap();
  } catch (error) {
    // Revert on error
    dispatch(addItem(item));
  }
};
```

## Testing Redux Logic

### Testing Slices

```typescript
import reducer, { fetchData } from './slice';

describe('slice reducer', () => {
  it('should handle fetchData.fulfilled', () => {
    const action = { type: fetchData.fulfilled.type, payload: mockData };
    const result = reducer(initialState, action);
    expect(result.data).toEqual(mockData);
  });
});
```

### Testing Thunks

```typescript
import { fetchData } from './slice';

const mockApi = jest.fn();
jest.mock('../api', () => ({ call: mockApi }));

describe('fetchData thunk', () => {
  it('should dispatch fulfilled action on success', async () => {
    mockApi.mockResolvedValue(mockResponse);

    const dispatch = jest.fn();
    const thunk = fetchData(params);

    await thunk(dispatch, () => ({}), undefined);

    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: fetchData.fulfilled.type })
    );
  });
});
```

This Redux architecture provides a solid foundation for scalable state management, with clear separation of concerns, type safety, and predictable state updates throughout the application.