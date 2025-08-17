import { api } from "./apiSlice";

export const usersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get mentors list
    getMentors: builder.query({
      query: ({ page = 1, limit = 10, search = "" } = {}) => ({
        url: "/api/users/mentor-list",
        params: { page, limit, search },
      }),
      providesTags: [{ type: "Mentors", id: "LIST" }],
      transformResponse: (response) => response.data,
    }),

    // Get mentees list
    getMentees: builder.query({
      query: ({ page = 1, limit = 10, search = "" } = {}) => ({
        url: "/api/users/mentee-list",
        params: { page, limit, search },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Mentees", id })),
              { type: "Mentees", id: "LIST" },
            ]
          : [{ type: "Mentees", id: "LIST" }],
      transformResponse: (response) => response.data,
    }),

    // Get mentee become mentor queue
    getMenteeBecomeMentorQueue: builder.query({
      query: () => "/api/users/mentee/become-mentor-queue",
      providesTags: [{ type: "Users", id: "MENTOR_QUEUE" }],
      transformResponse: (response) => response.data,
    }),

    // Approve mentor
    approveMentor: builder.mutation({
      query: ({ userId, approvalData }) => ({
        url: `/api/users/mentor/${userId}/approve`,
        method: "PUT",
        body: approvalData,
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: "Mentors", id: "LIST" },
        { type: "Users", id: "MENTOR_QUEUE" },
        { type: "Mentors", id: userId },
      ],
    }),

    // Reject mentor
    rejectMentor: builder.mutation({
      query: ({ userId, reason }) => ({
        url: `/api/users/mentor/${userId}/reject`,
        method: "PUT",
        body: { reason },
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: "Mentors", id: "LIST" },
        { type: "Users", id: "MENTOR_QUEUE" },
        { type: "Mentors", id: userId },
      ],
    }),

    // Get user by ID
    getUserById: builder.query({
      query: (id) => `/api/users/${id}`,
      providesTags: (result, error, id) => [{ type: "Users", id }],
      transformResponse: (response) => response.data,
    }),

    // Update user
    updateUser: builder.mutation({
      query: ({ id, userData }) => ({
        url: `/api/users/${id}`,
        method: "PUT",
        body: userData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Users", id },
        { type: "Mentors", id: "LIST" },
        { type: "Mentees", id: "LIST" },
      ],
    }),

    // Delete user
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/api/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "Users", id: "LIST" },
        { type: "Mentors", id: "LIST" },
        { type: "Mentees", id: "LIST" },
      ],
    }),
  }),
});

// Export hooks for use in components
export const {
  useGetMentorsQuery,
  useGetMenteesQuery,
  useGetMenteeBecomeMentorQueueQuery,
  useApproveMentorMutation,
  useRejectMentorMutation,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi;
