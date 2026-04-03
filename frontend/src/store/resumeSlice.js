import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../lib/api';

export const fetchResumes = createAsyncThunk(
  'resume/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/resumes');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch resumes');
    }
  }
);

export const fetchResumeById = createAsyncThunk(
  'resume/fetchSingle',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/resumes/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch resume');
    }
  }
);

export const createResume = createAsyncThunk(
  'resume/create',
  async (title, { rejectWithValue }) => {
    try {
      const response = await api.post('/resumes', { title });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create resume');
    }
  }
);

export const updateResume = createAsyncThunk(
  'resume/update',
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/resumes/${id}`, updates);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update resume');
    }
  }
);

export const deleteResume = createAsyncThunk(
  'resume/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/resumes/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete resume');
    }
  }
);

// Helper for local state updates before Sync
export const setResumeUpdates = createAsyncThunk(
  'resume/localUpdate',
  async (updates) => updates
);

const initialState = {
  resumes: [],
  currentResume: null,
  loading: false,
  error: null,
  saveStatus: 'idle', // 'idle' | 'saving' | 'saved'
};

const resumeSlice = createSlice({
  name: 'resume',
  initialState,
  reducers: {
    clearCurrentResume: (state) => {
      state.currentResume = null;
    },
    localUpdateResume: (state, action) => {
      if (state.currentResume) {
        state.currentResume = { ...state.currentResume, ...action.payload };
        state.saveStatus = 'saving';
      }
    },
    setSaveStatus: (state, action) => {
      state.saveStatus = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchResumes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchResumes.fulfilled, (state, action) => {
        state.loading = false;
        state.resumes = action.payload;
      })
      .addCase(fetchResumes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Single
      .addCase(fetchResumeById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchResumeById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentResume = action.payload;
      })
      .addCase(fetchResumeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(createResume.fulfilled, (state, action) => {
        state.resumes.unshift(action.payload);
      })
      // Update
      .addCase(updateResume.pending, (state) => {
        state.saveStatus = 'saving';
      })
      .addCase(updateResume.fulfilled, (state, action) => {
        state.currentResume = action.payload;
        
        const index = state.resumes.findIndex(r => r._id === action.payload._id);
        if (index !== -1) {
          state.resumes[index] = action.payload;
        }
        
        state.saveStatus = 'saved';
      })
      // Delete
      .addCase(deleteResume.fulfilled, (state, action) => {
        state.resumes = state.resumes.filter(r => r._id !== action.payload);
        if (state.currentResume?._id === action.payload) {
          state.currentResume = null;
        }
      });
  },
});

export const { clearCurrentResume, localUpdateResume, setSaveStatus } = resumeSlice.actions;
export default resumeSlice.reducer;
