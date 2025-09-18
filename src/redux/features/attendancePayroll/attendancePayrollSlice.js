import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { employeeCalculateIncentive, getListPayrollByEmployees, getSinglePayrollEmployee, upsertPayrollEmployee } from './attendancePayrollService'

const initialState = {
  payrollByEmployees: [],
  employeePayrollData: {},
  upsertPayrollData: {},
  monthRating: {},
  ratingHistory: [],
  calculatedIncentive: {},
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

export const listPayrollByEmployees = createAsyncThunk('listPayrollByEmployees/get-all', async (filters, thunkAPI) => {
  console.log('filters', filters)
  try {
    const response = await getListPayrollByEmployees(filters)
    return response
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Fetch EmployeeWise Rating Report failed'
    return thunkAPI.rejectWithValue(message)
  }
})

export const upsertPayroll = createAsyncThunk('payroll/upsert', async (payrollData, thunkAPI) => {
  try {
    const response = await upsertPayrollEmployee(payrollData)
    return response
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Registration failed'
    return thunkAPI.rejectWithValue(message)
  }
})

export const singlePayrollEmployee = createAsyncThunk('payroll/get', async ({ employeeId, month, year }, thunkAPI) => {
  try {
    const response = await getSinglePayrollEmployee(employeeId, { month, year })
    return response
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Fetch payroll failed'
    return thunkAPI.rejectWithValue(message)
  }
})

export const calculateIncentive = createAsyncThunk('incentive/calculate', async ({ employeeId, month, year }, thunkAPI) => {
  try {
    const response = await employeeCalculateIncentive(employeeId, { month, year })
    return response
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Fetch incentive calculation failed'
    return thunkAPI.rejectWithValue(message)
  }
})

export const attendancePayrollSlice = createSlice({
  name: 'attendancePayroll',
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
      .addCase(listPayrollByEmployees.pending, (state) => {
        state.isLoading = true
      })
      .addCase(listPayrollByEmployees.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.isSuccess = true
        state.payrollByEmployees = action.payload
        state.isLoading = false
      })
      .addCase(listPayrollByEmployees.rejected, (state, action) => {
        state.message = action.payload
        state.isError = true
        state.isLoading = false
      })
      .addCase(upsertPayroll.pending, (state) => {
        state.isLoading = true
      })
      .addCase(upsertPayroll.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.isSuccess = true
        state.upsertPayrollData = action.payload
        state.isLoading = false
      })
      .addCase(upsertPayroll.rejected, (state, action) => {
        state.message = action.payload
        state.isError = true
        state.isLoading = false
      })
      .addCase(singlePayrollEmployee.pending, (state) => {
        state.isLoading = true
      })
      .addCase(singlePayrollEmployee.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.isSuccess = true
        state.employeePayrollData = action.payload
        state.isLoading = false
      })
      .addCase(singlePayrollEmployee.rejected, (state, action) => {
        state.message = action.payload
        state.isError = true
        state.isLoading = false
      })
      .addCase(calculateIncentive.pending, (state) => {
        state.isLoading = true
      })
      .addCase(calculateIncentive.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.isSuccess = true
        state.calculatedIncentive = action.payload
        state.isLoading = false
      })
      .addCase(calculateIncentive.rejected, (state, action) => {
        state.message = action.payload
        state.isError = true
        state.isLoading = false
      })
  },
})

export const { logoutUser, clearState } = attendancePayrollSlice.actions
export default attendancePayrollSlice.reducer
