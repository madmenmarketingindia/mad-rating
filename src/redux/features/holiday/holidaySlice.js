import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  createHolidayByAdmin,
  updatedHoliday,
  getAllHoliday,
  getSingleHoliday,
  deleteHolidayByAdmin,
  getHolidaysByMonthByAll,
} from './holidayService'

const initialState = {
  isAuthenticated: false,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
  getAllHolidayData: {},
  createHolidayData: {},
  updatedHolidayData: {},
  getSingleHolidayData: {},
  deletedHolidayData: {},
  getHolidaysByMonthData: {},
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

export const fetchHolidays = createAsyncThunk('holiday/get-all-holiday', async (_, thunkAPI) => {
  try {
    const response = await getAllHoliday()
    return response
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Fetch holyday failed'
    return thunkAPI.rejectWithValue(message)
  }
})

export const createHoliday = createAsyncThunk('holiday/crete-holiday', async (holidayData, thunkAPI) => {
  try {
    const response = await createHolidayByAdmin(holidayData)
    return response
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Add Incentive failed'
    return thunkAPI.rejectWithValue(message)
  }
})

export const singleHoliday = createAsyncThunk('holiday/single-holiday', async (holidayId, thunkAPI) => {
  try {
    const response = await getSingleHoliday(holidayId)
    return response
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Fetch single holiday failed'
    return thunkAPI.rejectWithValue(message)
  }
})

export const editHoliday = createAsyncThunk('holiday/update-incentive', async ({ holidayId, holidayData }, thunkAPI) => {
  try {
    const response = await updatedHoliday(holidayId, holidayData)
    return response
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Update Incentive failed'
    return thunkAPI.rejectWithValue(message)
  }
})

export const deleteHoliday = createAsyncThunk('holiday/delete-holiday', async (holidayId, thunkAPI) => {
  try {
    const response = await deleteHolidayByAdmin(holidayId)
    return response
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Delete Holiday failed'
    return thunkAPI.rejectWithValue(message)
  }
})

export const getHolidaysByMonth = createAsyncThunk('holiday/get-moth-wise-holiday', async (_, thunkAPI) => {
  try {
    const response = await getHolidaysByMonthByAll()
    return response
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Month wise holiday show failed'
    return thunkAPI.rejectWithValue(message)
  }
})

export const holidaySlice = createSlice({
  name: 'holiday',
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
      .addCase(fetchHolidays.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchHolidays.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.isSuccess = true
        state.getAllHolidayData = action.payload
        state.isLoading = false
      })
      .addCase(fetchHolidays.rejected, (state, action) => {
        state.message = action.payload
        state.isError = true
        state.isLoading = false
      })
      .addCase(createHoliday.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createHoliday.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.isSuccess = true
        state.createHolidayData = action.payload
        state.isLoading = false
      })
      .addCase(createHoliday.rejected, (state, action) => {
        state.message = action.payload
        state.isError = true
        state.isLoading = false
      })
      .addCase(editHoliday.pending, (state) => {
        state.isLoading = true
      })
      .addCase(editHoliday.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.isSuccess = true
        state.updatedIncentiveData = action.payload
        state.isLoading = false
      })
      .addCase(editHoliday.rejected, (state, action) => {
        state.message = action.payload
        state.isError = true
        state.isLoading = false
      })
      .addCase(singleHoliday.pending, (state) => {
        state.isLoading = true
      })
      .addCase(singleHoliday.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.isSuccess = true
        state.getSingleHolidayData = action.payload
        state.isLoading = false
      })
      .addCase(singleHoliday.rejected, (state, action) => {
        state.message = action.payload
        state.isError = true
        state.isLoading = false
      })
      .addCase(deleteHoliday.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteHoliday.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.isSuccess = true
        state.deletedHolidayData = action.payload
        state.isLoading = false
      })
      .addCase(deleteHoliday.rejected, (state, action) => {
        state.message = action.payload
        state.isError = true
        state.isLoading = false
      })
      .addCase(getHolidaysByMonth.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getHolidaysByMonth.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.isSuccess = true
        state.getHolidaysByMonthData = action.payload
        state.isLoading = false
      })
      .addCase(getHolidaysByMonth.rejected, (state, action) => {
        state.message = action.payload
        state.isError = true
        state.isLoading = false
      })
  },
})

export const { logoutUser, clearState } = holidaySlice.actions
export default holidaySlice.reducer
