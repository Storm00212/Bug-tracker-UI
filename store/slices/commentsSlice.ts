import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Comment, CreateComment, UpdateComment } from '../../types';
import { commentsAPI } from '../../services/apiService';

interface CommentsState {
  comments: Comment[];
  isLoading: boolean;
  error: string | null;
}

const initialState: CommentsState = {
  comments: [],
  isLoading: false,
  error: null,
};

export const fetchCommentsByBug = createAsyncThunk(
  'comments/fetchCommentsByBug',
  async (bugId: number, { rejectWithValue }) => {
    try {
      const response = await commentsAPI.getByBug(bugId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch comments');
    }
  }
);

export const createComment = createAsyncThunk(
  'comments/createComment',
  async (comment: CreateComment, { rejectWithValue }) => {
    try {
      const response = await commentsAPI.create(comment);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create comment');
    }
  }
);

export const updateComment = createAsyncThunk(
  'comments/updateComment',
  async ({ id, comment }: { id: number; comment: UpdateComment }, { rejectWithValue }) => {
    try {
      const response = await commentsAPI.update(id, comment);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update comment');
    }
  }
);

export const deleteComment = createAsyncThunk(
  'comments/deleteComment',
  async (id: number, { rejectWithValue }) => {
    try {
      await commentsAPI.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete comment');
    }
  }
);

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommentsByBug.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCommentsByBug.fulfilled, (state, action: PayloadAction<Comment[]>) => {
        state.isLoading = false;
        state.comments = action.payload;
      })
      .addCase(fetchCommentsByBug.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createComment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createComment.fulfilled, (state, action: PayloadAction<Comment>) => {
        state.isLoading = false;
        state.comments.push(action.payload);
      })
      .addCase(createComment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateComment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateComment.fulfilled, (state, action: PayloadAction<Comment>) => {
        state.isLoading = false;
        const index = state.comments.findIndex(c => c.CommentID === action.payload.CommentID);
        if (index !== -1) {
          state.comments[index] = action.payload;
        }
      })
      .addCase(updateComment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteComment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteComment.fulfilled, (state, action: PayloadAction<number>) => {
        state.isLoading = false;
        state.comments = state.comments.filter(c => c.CommentID !== action.payload);
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = commentsSlice.actions;
export default commentsSlice.reducer;