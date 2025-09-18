import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  getDepartmentRating,
  getDepartmentStats,
  getEmployeeMonthlyRating,
  getEmployeeUpcomingBirthday,
  getEmployeeWorkAnniversary,
  getEmployeeYearlyRatings,
} from './dashboardService'

const initialState = {
  dashboardData: {},
  departmentStatsData: {},
  departmentRatingData: {},
  upcomingBirthday: {},
  upcomingWorkAnniversary: {},
  empMonthlyRating: {},
  yearlyRatings: {},
  isAuthenticated: false,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
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

export const departmentStats = createAsyncThunk('d/department-stats', async (data, thunkAPI) => {
  try {
    const response = await getDepartmentStats(data)
    return response
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Department Stats failed'
    return thunkAPI.rejectWithValue(message)
  }
})

export const departmentRating = createAsyncThunk('d/department-rating', async (data, thunkAPI) => {
  try {
    const response = await getDepartmentRating(data)
    return response
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Department Rating failed'
    return thunkAPI.rejectWithValue(message)
  }
})

export const employeeUpcomingBirthday = createAsyncThunk('d/upcoming-birthday', async (_, thunkAPI) => {
  try {
    const response = await getEmployeeUpcomingBirthday()
    return response
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Department Rating failed'
    return thunkAPI.rejectWithValue(message)
  }
})

export const employeeWorkAnniversary = createAsyncThunk('d/work-anniversary', async (_, thunkAPI) => {
  try {
    const response = await getEmployeeWorkAnniversary()
    return response
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'EmployeeWork anniversary failed'
    return thunkAPI.rejectWithValue(message)
  }
})

export const employeeMonthlyRating = createAsyncThunk('d/employee-rating', async (userId_, thunkAPI) => {
  try {
    const response = await getEmployeeMonthlyRating()
    return response
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'EmployeeWork anniversary failed'
    return thunkAPI.rejectWithValue(message)
  }
})

export const employeeYearlyRatings = createAsyncThunk('d/yearly-employee-rating', async (userId_, thunkAPI) => {
  try {
    const response = await getEmployeeYearlyRatings()
    return response
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'EmployeeWork anniversary failed'
    return thunkAPI.rejectWithValue(message)
  }
})

export const dashboardSlice = createSlice({
  name: 'dashboard',
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
      .addCase(departmentStats.pending, (state) => {
        state.isLoading = true
      })
      .addCase(departmentStats.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.isSuccess = true
        state.departmentStatsData = action.payload
        state.isLoading = false
      })
      .addCase(departmentStats.rejected, (state, action) => {
        state.message = action.payload
        state.isError = true
        state.isLoading = false
      })
      .addCase(departmentRating.pending, (state) => {
        state.isLoading = true
      })
      .addCase(departmentRating.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.isSuccess = true
        state.departmentRatingData = action.payload
        state.isLoading = false
      })
      .addCase(departmentRating.rejected, (state, action) => {
        state.message = action.payload
        state.isError = true
        state.isLoading = false
      })
      .addCase(employeeUpcomingBirthday.pending, (state) => {
        state.isLoading = true
      })
      .addCase(employeeUpcomingBirthday.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.isSuccess = true
        state.upcomingBirthday = action.payload
        state.isLoading = false
      })
      .addCase(employeeUpcomingBirthday.rejected, (state, action) => {
        state.message = action.payload
        state.isError = true
        state.isLoading = false
      })
      .addCase(employeeWorkAnniversary.pending, (state) => {
        state.isLoading = true
      })
      .addCase(employeeWorkAnniversary.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.isSuccess = true
        state.upcomingWorkAnniversary = action.payload
        state.isLoading = false
      })
      .addCase(employeeWorkAnniversary.rejected, (state, action) => {
        state.message = action.payload
        state.isError = true
        state.isLoading = false
      })
      .addCase(employeeMonthlyRating.pending, (state) => {
        state.isLoading = true
      })
      .addCase(employeeMonthlyRating.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.isSuccess = true
        state.empMonthlyRating = action.payload
        state.isLoading = false
      })
      .addCase(employeeMonthlyRating.rejected, (state, action) => {
        state.message = action.payload
        state.isError = true
        state.isLoading = false
      })
      .addCase(employeeYearlyRatings.pending, (state) => {
        state.isLoading = true
      })
      .addCase(employeeYearlyRatings.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.isSuccess = true
        state.yearlyRatings = action.payload
        state.isLoading = false
      })
      .addCase(employeeYearlyRatings.rejected, (state, action) => {
        state.message = action.payload
        state.isError = true
        state.isLoading = false
      })
  },
})

export const { logoutUser, clearState } = dashboardSlice.actions
export default dashboardSlice.reducer
