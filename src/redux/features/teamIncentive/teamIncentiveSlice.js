import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  createTeamWiseIncentive,
  deleteTeamWiseIncentive,
  editTeamWiseIncentive,
  getAllTeamIncentive,
  getSingleTeamIncentive,
} from './teamIncentiveService'

const initialState = {
  isAuthenticated: false,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
  getAllTeamIncentiveData: {},
  createIncentiveData: {},
  updatedIncentiveData: {},
  singleIncentiveData: {},
}

const removeUserFromStorage = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user')
  }
}

const loadUserFromStorageHelper = () => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  }
  return null
}

// Async action to load user from localStorage on app start
export const loadUserFromStorage = createAsyncThunk('user/loadFromStorage', async (_, thunkAPI) => {
  try {
    const user = loadUserFromStorageHelper()
    return user
  } catch (error) {
    return thunkAPI.rejectWithValue('Failed to load user.')
  }
})

export const allTeamIncentive = createAsyncThunk('team/get-all-incentive', async ({ month, year } = {}, thunkAPI) => {
  try {
    const filters = {}
    if (month) filters.month = month
    if (year) filters.year = year

    const response = await getAllTeamIncentive(filters)
    return response
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Fetch Team Incentive failed'
    return thunkAPI.rejectWithValue(message)
  }
})

export const createTeamIncentive = createAsyncThunk('team/add-incentive', async (incentiveData, thunkAPI) => {
  try {
    const response = await createTeamWiseIncentive(incentiveData)
    return response
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Add Incentive failed'
    return thunkAPI.rejectWithValue(message)
  }
})

export const updateTeamWiseIncentive = createAsyncThunk('team/update-incentive', async ({ incentiveId, incentiveData }, thunkAPI) => {
  try {
    const response = await editTeamWiseIncentive(incentiveId, incentiveData)
    return response
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Update Incentive failed'
    return thunkAPI.rejectWithValue(message)
  }
})

export const singleTeamWiseIncentive = createAsyncThunk('team/single-incentive', async (incentiveId, thunkAPI) => {
  try {
    const response = await getSingleTeamIncentive(incentiveId)
    return response
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Get Single Incentive failed'
    return thunkAPI.rejectWithValue(message)
  }
})

export const deleteTeamIncentive = createAsyncThunk('team/delete-incentive', async (incentiveId, thunkAPI) => {
  try {
    const response = await deleteTeamWiseIncentive(incentiveId)
    return response
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Update Incentive failed'
    return thunkAPI.rejectWithValue(message)
  }
})

export const teamIncentiveSlice = createSlice({
  name: 'teamIncentive',
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.isError = false
      state.isSuccess = false
      state.isLoading = false
      state.message = ''
      removeUserFromStorage()
    },
    clearState: (state) => {
      state.isError = false
      state.isSuccess = false
      state.message = ''
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUserFromStorage.fulfilled, (state, action) => {
        state.user = action.payload
        state.isAuthenticated = !!action.payload
      })
      .addCase(allTeamIncentive.pending, (state) => {
        state.isLoading = true
      })
      .addCase(allTeamIncentive.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.isSuccess = true
        state.getAllTeamIncentiveData = action.payload
        state.isLoading = false
      })
      .addCase(allTeamIncentive.rejected, (state, action) => {
        state.message = action.payload
        state.isError = true
        state.isLoading = false
      })
      .addCase(createTeamIncentive.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createTeamIncentive.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.isSuccess = true
        state.createIncentiveData = action.payload
        state.isLoading = false
      })
      .addCase(createTeamIncentive.rejected, (state, action) => {
        state.message = action.payload
        state.isError = true
        state.isLoading = false
      })
      .addCase(updateTeamWiseIncentive.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateTeamWiseIncentive.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.isSuccess = true
        state.updatedIncentiveData = action.payload
        state.isLoading = false
      })
      .addCase(updateTeamWiseIncentive.rejected, (state, action) => {
        state.message = action.payload
        state.isError = true
        state.isLoading = false
      })
      .addCase(singleTeamWiseIncentive.pending, (state) => {
        state.isLoading = true
      })
      .addCase(singleTeamWiseIncentive.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.isSuccess = true
        state.singleIncentiveData = action.payload
        state.isLoading = false
      })
      .addCase(singleTeamWiseIncentive.rejected, (state, action) => {
        state.message = action.payload
        state.isError = true
        state.isLoading = false
      })
      .addCase(deleteTeamIncentive.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteTeamIncentive.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.isSuccess = true
        state.singleIncentiveData = action.payload
        state.isLoading = false
      })
      .addCase(deleteTeamIncentive.rejected, (state, action) => {
        state.message = action.payload
        state.isError = true
        state.isLoading = false
      })
  },
})

export const { logoutUser, clearState } = teamIncentiveSlice.actions
export default teamIncentiveSlice.reducer
