import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Bug, CreateBug, UpdateBug } from '../../types';
import { bugsAPI } from '../../services/apiService';

interface BugsState {
  bugs: Bug[];
  isLoading: boolean;
  error: string | null;
}

const initialState: BugsState = {
  bugs: [],
  isLoading: false,
  error: null,
};

export const fetchBugs = createAsyncThunk(
  'bugs/fetchBugs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await bugsAPI.getAll();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch bugs');
    }
  }
);

export const fetchBugsByProject = createAsyncThunk(
  'bugs/fetchBugsByProject',
  async (projectId: number, { rejectWithValue }) => {
    try {
      const response = await bugsAPI.getByProject(projectId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch bugs by project');
    }
  }
);

export const createBug = createAsyncThunk(
  'bugs/createBug',
  async (bug: CreateBug, { rejectWithValue }) => {
    try {
      const response = await bugsAPI.create(bug);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create bug');
    }
  }
);

export const updateBug = createAsyncThunk(
  'bugs/updateBug',
  async ({ id, bug }: { id: number; bug: UpdateBug }, { rejectWithValue }) => {
    try {
      const response = await bugsAPI.update(id, bug);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update bug');
    }
  }
);

export const deleteBug = createAsyncThunk(
  'bugs/deleteBug',
  async (id: number, { rejectWithValue }) => {
    try {
      await bugsAPI.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete bug');
    }
  }
);

const bugsSlice = createSlice({
  name: 'bugs',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBugs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBugs.fulfilled, (state, action: PayloadAction<Bug[]>) => {
        state.isLoading = false;
        state.bugs = action.payload;
      })
      .addCase(fetchBugs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchBugsByProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBugsByProject.fulfilled, (state, action: PayloadAction<Bug[]>) => {
        state.isLoading = false;
        state.bugs = action.payload;
      })
      .addCase(fetchBugsByProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createBug.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createBug.fulfilled, (state, action: PayloadAction<Bug>) => {
        state.isLoading = false;
        state.bugs.push(action.payload);
      })
      .addCase(createBug.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateBug.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateBug.fulfilled, (state, action: PayloadAction<Bug>) => {
        state.isLoading = false;
        const index = state.bugs.findIndex(b => b.BugID === action.payload.BugID);
        if (index !== -1) {
          state.bugs[index] = action.payload;
        }
      })
      .addCase(updateBug.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteBug.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteBug.fulfilled, (state, action: PayloadAction<number>) => {
        state.isLoading = false;
        state.bugs = state.bugs.filter(b => b.BugID !== action.payload);
      })
      .addCase(deleteBug.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = bugsSlice.actions;
export default bugsSlice.reducer;