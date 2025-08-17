# Redux RTK Query Implementation

This document outlines the comprehensive Redux RTK Query implementation for the Mongul Admin Frontend, following production-grade architecture principles and best practices.

## 🏗️ Architecture Overview

The implementation follows a scalable, modular architecture with clear separation of concerns:

```
src/store/
├── index.js                 # Main store configuration
├── api/
│   ├── apiSlice.js         # Base API configuration
│   └── usersApi.js         # User-related API endpoints
├── slices/
│   ├── authSlice.js        # Authentication state management
│   └── uiSlice.js          # UI state management
└── hooks.js                # Custom hooks for common operations
```

## 🚀 Key Features

### 1. **RTK Query Integration**

- **Automatic Caching**: Built-in caching with intelligent invalidation
- **Request Deduplication**: Prevents duplicate API calls
- **Background Updates**: Automatic data synchronization
- **Optimistic Updates**: Immediate UI feedback with rollback on error

### 2. **Production-Grade State Management**

- **Immutable Updates**: Using Immer for safe state mutations
- **Normalized State**: Efficient data storage and retrieval
- **Selectors**: Memoized selectors for performance optimization
- **Middleware**: Custom middleware for authentication and error handling

### 3. **Type Safety & Error Handling**

- **Comprehensive Error Handling**: Centralized error management
- **Loading States**: Built-in loading state management
- **Retry Logic**: Automatic retry on network failures
- **Authentication**: Automatic token refresh and logout on 401

## 📁 File Structure

### Store Configuration (`src/store/index.js`)

```javascript
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth: authReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
  devTools: process.env.NODE_ENV !== "production",
});

setupListeners(store.dispatch);
```

### API Slice (`src/store/api/apiSlice.js`)

```javascript
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_API_URL || "http://localhost:8086",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const api = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["Users", "Mentors", "Mentees", "Programs"],
  endpoints: () => ({}),
});
```

### Users API (`src/store/api/usersApi.js`)

```javascript
export const usersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMentors: builder.query({
      query: ({ page = 1, limit = 10, search = "" } = {}) => ({
        url: "/api/users/mentor-list",
        params: { page, limit, search },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Mentors", id })),
              { type: "Mentors", id: "LIST" },
            ]
          : [{ type: "Mentors", id: "LIST" }],
    }),

    approveMentor: builder.mutation({
      query: ({ userId, approvalData }) => ({
        url: `/api/users/mentor/${userId}`,
        method: "PUT",
        body: approvalData,
      }),
      invalidatesTags: ["Mentors", "Users"],
    }),
  }),
});
```

## 🎣 Custom Hooks

### Authentication Hook

```javascript
const { user, isAuthenticated, loading } = useSelector(selectAuth);
const dispatch = useAppDispatch();

const handleLogin = async (credentials) => {
  try {
    await dispatch(loginAdmin(credentials)).unwrap();
    // Handle success
  } catch (error) {
    // Handle error
  }
};
```

### RTK Query Hooks

```javascript
const {
  data: mentors,
  isLoading,
  error,
} = useGetMentorsQuery({ page: 1, limit: 10 });
const [approveMentor, { isLoading: approving }] = useApproveMentorMutation();

const handleApprove = async (mentorId) => {
  try {
    await approveMentor({
      userId: mentorId,
      approvalData: { isApproved: true },
    }).unwrap();
    // Success notification
  } catch (error) {
    // Error handling
  }
};
```

### UI Management Hooks

```javascript
const { addNotification, removeNotification } = useNotifications();
const { isOpen, open, close } = useModal("mentorModal");
const { search, setSearchQuery, setFilters } = useSearchAndFilters();
const { pagination, setPage, nextPage, prevPage } = usePagination();
```

## 🔄 State Management Patterns

### 1. **Slice Pattern**

Each domain has its own slice with actions, reducers, and selectors:

```javascript
const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, isAuthenticated: false },
  reducers: { logout, clearError },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
      });
  },
});
```

### 2. **Async Thunk Pattern**

For complex async operations:

```javascript
export const loginAdmin = createAsyncThunk(
  "auth/loginAdmin",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/auth/admin-login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
```

### 3. **Tag-Based Cache Invalidation**

RTK Query uses tags for intelligent cache management:

```javascript
providesTags: (result) =>
  result
    ? [
        ...result.data.map(({ id }) => ({ type: 'Mentors', id })),
        { type: 'Mentors', id: 'LIST' },
      ]
    : [{ type: 'Mentors', id: 'LIST' }],

invalidatesTags: ['Mentors', 'Users'],
```

## 🎨 UI Integration

### Notification System

```javascript
const { addNotification } = useNotifications();

addNotification({
  type: "success",
  message: "Operation completed successfully!",
  duration: 3000,
  position: { vertical: "top", horizontal: "right" },
});
```

### Loading States

```javascript
const { data, isLoading, error } = useGetMentorsQuery();

if (isLoading) return <LinearProgress />;
if (error) return <ErrorMessage error={error} />;
```

## 🧪 Testing Considerations

### Unit Testing

```javascript
import { renderWithProviders } from "../test-utils";

test("should handle mentor approval", async () => {
  const { getByText } = renderWithProviders(<Dashboard />);

  // Test implementation
});
```

### Integration Testing

```javascript
import { rest } from "msw";
import { setupServer } from "msw/node";

const server = setupServer(
  rest.get("/api/users/mentor-list", (req, res, ctx) => {
    return res(ctx.json({ data: mockMentors }));
  })
);
```

## 🚀 Performance Optimizations

### 1. **Memoized Selectors**

```javascript
export const selectUserById = createSelector(
  [selectUsers, (state, userId) => userId],
  (users, userId) => users.find((user) => user.id === userId)
);
```

### 2. **Lazy Loading**

```javascript
const { data, isLoading } = useGetMentorsQuery(
  { page: currentPage, limit: pageSize },
  { skip: !shouldFetch }
);
```

### 3. **Prefetching**

```javascript
const prefetchNextPage = () => {
  if (hasNextPage) {
    dispatch(
      api.util.prefetch("getMentors", {
        page: currentPage + 1,
        limit: pageSize,
      })
    );
  }
};
```

## 🔒 Security Features

### Authentication Middleware

- Automatic token inclusion in headers
- 401 handling with automatic logout
- Secure token storage in localStorage

### Error Boundaries

- Centralized error handling
- User-friendly error messages
- Fallback UI components

## 📊 Monitoring & Debugging

### Redux DevTools

- State inspection
- Action replay
- Time-travel debugging
- Performance profiling

### Logging

- Action logging in development
- Error tracking
- Performance metrics

## 🔄 Migration Guide

### From Axios to RTK Query

1. **Replace API calls**:

   ```javascript
   // Before
   const response = await axios.get("/api/users");
   setUsers(response.data);

   // After
   const { data: users } = useGetUsersQuery();
   ```

2. **Replace state management**:

   ```javascript
   // Before
   const [users, setUsers] = useState([]);
   const [loading, setLoading] = useState(false);

   // After
   const { data: users, isLoading } = useGetUsersQuery();
   ```

3. **Replace mutations**:

   ```javascript
   // Before
   const handleCreate = async (userData) => {
     const response = await axios.post("/api/users", userData);
     setUsers([...users, response.data]);
   };

   // After
   const [createUser] = useCreateUserMutation();
   const handleCreate = async (userData) => {
     await createUser(userData).unwrap();
   };
   ```

## 🎯 Best Practices

### 1. **File Organization**

- Keep API slices close to their domain
- Use consistent naming conventions
- Separate concerns between API, state, and UI

### 2. **Error Handling**

- Always handle errors gracefully
- Provide user-friendly error messages
- Log errors for debugging

### 3. **Performance**

- Use appropriate cache policies
- Implement pagination for large datasets
- Optimize re-renders with memoization

### 4. **Testing**

- Test all async operations
- Mock API responses
- Test error scenarios

## 🔮 Future Enhancements

### Planned Features

- **Offline Support**: Service worker integration
- **Real-time Updates**: WebSocket integration
- **Advanced Caching**: Custom cache policies
- **Analytics**: Performance monitoring

### Scalability Considerations

- **Code Splitting**: Lazy load store slices
- **Bundle Optimization**: Tree shaking for unused code
- **Memory Management**: Efficient cache cleanup

## 📚 Additional Resources

- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [RTK Query Documentation](https://redux-toolkit.js.org/rtk-query/overview)
- [Redux Best Practices](https://redux.js.org/style-guide/)
- [React Performance Optimization](https://react.dev/learn/render-and-commit)

---

This implementation provides a solid foundation for scalable, maintainable state management in the Mongul Admin Frontend, following industry best practices and production-grade standards.
