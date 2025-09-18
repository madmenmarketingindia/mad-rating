import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { adminDownloadSalarySlip, getEmployeeSalaryDetail, getSalaryByEmployeeAndYear } from './salaryService'

const initialState = {
  isAuthenticated: false,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
  salaryByEmployee: {},
  salaryDetailed: {},
  salarySlipDownload: {},
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

export const salaryByEmployeeAndYear = createAsyncThunk('salary/get-all', async ({ employeeId, year }, thunkAPI) => {
  try {
    const response = await getSalaryByEmployeeAndYear(employeeId, { year })
    return response
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Fetch EmployeeWise Rating Report failed'
    return thunkAPI.rejectWithValue(message)
  }
})

export const employeeSalaryDetail = createAsyncThunk('salary/details', async ({ employeeId, year }, thunkAPI) => {
  try {
    const response = await getEmployeeSalaryDetail(employeeId, { year })
    return response
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Fetch EmployeeWise Rating Report failed'
    return thunkAPI.rejectWithValue(message)
  }
})

export const downloadSalarySlip = createAsyncThunk('salary/downloadSlip', async ({ employeeId, month, year }, thunkAPI) => {
  try {
    const response = await adminDownloadSalarySlip(employeeId, { month, year })
    return response.data // this will be a Blob
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Download Salary Slip failed'
    return thunkAPI.rejectWithValue(message)
  }
})

export const salarySlice = createSlice({
  name: 'salary',
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
      .addCase(salaryByEmployeeAndYear.pending, (state) => {
        state.isLoading = true
      })
      .addCase(salaryByEmployeeAndYear.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.isSuccess = true
        state.salaryByEmployee = action.payload
        state.isLoading = false
      })
      .addCase(salaryByEmployeeAndYear.rejected, (state, action) => {
        state.message = action.payload
        state.isError = true
        state.isLoading = false
      })
      .addCase(employeeSalaryDetail.pending, (state) => {
        state.isLoading = true
      })
      .addCase(employeeSalaryDetail.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.isSuccess = true
        state.salaryDetailed = action.payload
        state.isLoading = false
      })
      .addCase(employeeSalaryDetail.rejected, (state, action) => {
        state.message = action.payload
        state.isError = true
        state.isLoading = false
      })
      .addCase(downloadSalarySlip.pending, (state) => {
        state.isLoading = true
      })
      .addCase(downloadSalarySlip.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.isSuccess = true
        state.salarySlipDownload = action.payload
        state.isLoading = false
      })
      .addCase(downloadSalarySlip.rejected, (state, action) => {
        state.message = action.payload
        state.isError = true
        state.isLoading = false
      })
  },
})

export const { logoutUser, clearState } = salarySlice.actions
export default salarySlice.reducer
