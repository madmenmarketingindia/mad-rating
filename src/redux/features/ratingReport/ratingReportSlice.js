import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  getEmployeeWiseRatingReport,
  createEmployeeRating,
  getSingleMonthRating,
  getRatingHistory,
  getEmployeeYearlyRatings,
} from './ratingReportService'

const initialState = {
  ratingReport: null,
  createdRating: {},
  monthRating: {},
  yearlyRatings: {},
  ratingHistory: [],
  isAuthenticated: false,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
  isHistoryLoading: false,
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

export const employeeWiseRatingReport = createAsyncThunk('ratingReport/get-all', async (_, thunkAPI) => {
  try {
    const response = await getEmployeeWiseRatingReport()
    return response
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Fetch EmployeeWise Rating Report failed'
    return thunkAPI.rejectWithValue(message)
  }
})

export const createRating = createAsyncThunk('rating/create', async (ratingData, thunkAPI) => {
  try {
    const response = await createEmployeeRating(ratingData)
    return response
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Rating creation failed'
    return thunkAPI.rejectWithValue(message)
  }
})

export const singleMonthRating = createAsyncThunk('rating/singleMoth', async (ratingData, thunkAPI) => {
  try {
    const response = await getSingleMonthRating(ratingData)
    return response
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Fetch single month Rating  failed'
    return thunkAPI.rejectWithValue(message)
  }
})

export const employeeRatingHistory = createAsyncThunk('rating/history', async (employeeId, thunkAPI) => {
  try {
    const response = await getRatingHistory(employeeId)
    return response
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Fetch Rating Employee History  failed'
    return thunkAPI.rejectWithValue(message)
  }
})

export const employeeYearlyRatings = createAsyncThunk('rating/yearly-history', async (employeeId, thunkAPI) => {
  try {
    const response = await getEmployeeYearlyRatings(employeeId)
    return response
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Fetch Rating yearly Employee History  failed'
    return thunkAPI.rejectWithValue(message)
  }
})

export const ratingReportSlice = createSlice({
  name: 'ratingReport',
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

      .addCase(employeeWiseRatingReport.pending, (state) => {
        state.isLoading = true
      })
      .addCase(employeeWiseRatingReport.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.isSuccess = true
        state.allEmployeeRating = action.payload
        state.isLoading = false
      })
      .addCase(employeeWiseRatingReport.rejected, (state, action) => {
        state.message = action.payload
        state.isError = true
        state.isLoading = false
      })

      .addCase(createRating.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createRating.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.isSuccess = true
        state.createdRating = action.payload
        state.isLoading = false
      })
      .addCase(createRating.rejected, (state, action) => {
        state.message = action.payload
        state.isError = true
        state.isLoading = false
      })
      .addCase(singleMonthRating.pending, (state) => {
        state.isLoading = true
      })
      .addCase(singleMonthRating.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.isSuccess = true
        state.monthRating = action.payload
        state.isLoading = false
      })
      .addCase(singleMonthRating.rejected, (state, action) => {
        state.message = action.payload
        state.isError = true
        state.isLoading = false
      })
      .addCase(employeeRatingHistory.pending, (state) => {
        state.isHistoryLoading = true
      })
      .addCase(employeeRatingHistory.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.isSuccess = true
        state.ratingHistory = action.payload
        state.isHistoryLoading = false
      })
      .addCase(employeeRatingHistory.rejected, (state, action) => {
        state.message = action.payload
        state.isError = true
        state.isHistoryLoading = false
      })
      .addCase(employeeYearlyRatings.pending, (state) => {
        state.isHistoryLoading = true
      })
      .addCase(employeeYearlyRatings.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.isSuccess = true
        state.yearlyRatings = action.payload
        state.isHistoryLoading = false
      })
      .addCase(employeeYearlyRatings.rejected, (state, action) => {
        state.message = action.payload
        state.isError = true
        state.isHistoryLoading = false
      })
  },
})

export const { logoutUser, clearState } = ratingReportSlice.actions
export default ratingReportSlice.reducer
