import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  createEmployee,
  deleteEmployeeByAdmin,
  editEmployee,
  getAllDepartments,
  getAllEmployee,
  getEmployee,
  getEmployeeProfile,
  getEmployeesByDepartment,
  userStatus,
} from './employeeService.js'

const initialState = {
  employee: null,
  isAuthenticated: false,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
  allEmployee: [],
  getEmployeeData: {},
  updatedEmployee: {},
  deleteEmployee: {},
  getEmProfile: {},
  allDepartmentsData: {},
  employeesByDepartmentData: {},
}

// Helper functions to handle localStorage safely
const saveUserToStorage = (user) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(user))
  }
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

// Login
export const login = createAsyncThunk('user/login', async (userdata, thunkAPI) => {
  try {
    const response = await LoginInUser(userdata)
    saveUserToStorage(response)
    return response
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Login failed'
    return thunkAPI.rejectWithValue(message)
  }
})

// get all users
export const getEmployees = createAsyncThunk('employee/get-all', async (_, thunkAPI) => {
  try {
    const response = await getAllEmployee()
    return response
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Fetch Employee failed'
    return thunkAPI.rejectWithValue(message)
  }
})

// register a user by admin
export const registerEmployee = createAsyncThunk('employee/register', async (userdata, thunkAPI) => {
  try {
    const response = await createEmployee(userdata)
    return response
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Registration failed'
    return thunkAPI.rejectWithValue(message)
  }
})

export const updateEmployee = createAsyncThunk('employee/update-employee', async (employeeData, thunkAPI) => {
  try {
    return await editEmployee(employeeData)
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message)
  }
})

export const deleteEmployee = createAsyncThunk('employee/delete-employee', async (employeeId, thunkAPI) => {
  try {
    return await deleteEmployeeByAdmin(employeeId)
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message)
  }
})

export const getEmployeeById = createAsyncThunk('employee/get-employeeId', async (employeeId, thunkAPI) => {
  try {
    return await getEmployee(employeeId)
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message)
  }
})

export const toggleUserStatus = createAsyncThunk('user/active-toggle', async (userData, thunkAPI) => {
  try {
    return await userStatus(userData)
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message)
  }
})

export const employeeProfile = createAsyncThunk('employee/profile', async (employeeId, thunkAPI) => {
  try {
    return await getEmployeeProfile(employeeId)
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message)
  }
})

export const allDepartments = createAsyncThunk('employee/get-all-department', async (_, thunkAPI) => {
  try {
    const response = await getAllDepartments()
    return response
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Fetch Employee failed'
    return thunkAPI.rejectWithValue(message)
  }
})

export const employeesByDepartment = createAsyncThunk('employee/get-all-employee-department', async (departmentName, thunkAPI) => {
  try {
    const response = await getEmployeesByDepartment(departmentName)
    return response
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Fetch Employee failed'
    return thunkAPI.rejectWithValue(message)
  }
})

export const employeeSlice = createSlice({
  name: 'employee',
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
      .addCase(registerEmployee.pending, (state) => {
        state.isLoading = true
      })
      .addCase(registerEmployee.fulfilled, (state, action) => {
        state.user = action.payload
        state.isAuthenticated = true
        state.isSuccess = true
        state.isLoading = false
      })
      .addCase(registerEmployee.rejected, (state, action) => {
        state.message = action.payload
        state.isError = true
        state.isLoading = false
      })
      .addCase(getEmployees.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getEmployees.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.isSuccess = true
        state.allEmployee = action.payload
        state.isLoading = false
      })
      .addCase(getEmployees.rejected, (state, action) => {
        state.message = action.payload
        state.isError = true
        state.isLoading = false
      })

      .addCase(updateEmployee.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.isSuccess = true
        state.updatedEmployee = action.payload
        state.isLoading = false
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.message = action.payload
        state.isError = true
        state.isLoading = false
      })
      .addCase(deleteEmployee.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.isSuccess = true
        state.deleteEmployee = action.payload
        state.isLoading = false
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.message = action.payload
        state.isError = true
        state.isLoading = false
      })
      .addCase(getEmployeeById.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getEmployeeById.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.isSuccess = true
        state.getEmployeeData = action.payload
        state.isLoading = false
      })
      .addCase(getEmployeeById.rejected, (state, action) => {
        state.message = action.payload
        state.isError = true
        state.isLoading = false
      })
      .addCase(toggleUserStatus.pending, (state) => {
        state.isLoading = true
      })
      .addCase(toggleUserStatus.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.isSuccess = true
        state.getUserData = action.payload
        state.isLoading = false
      })
      .addCase(toggleUserStatus.rejected, (state, action) => {
        state.message = action.payload
        state.isError = true
        state.isLoading = false
      })
      .addCase(employeeProfile.pending, (state) => {
        state.isLoading = true
      })
      .addCase(employeeProfile.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.isSuccess = true
        state.getEmProfile = action.payload
        state.isLoading = false
      })
      .addCase(employeeProfile.rejected, (state, action) => {
        state.message = action.payload
        state.isError = true
        state.isLoading = false
      })
      .addCase(allDepartments.pending, (state) => {
        state.isLoading = true
      })
      .addCase(allDepartments.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.isSuccess = true
        state.allDepartmentsData = action.payload
        state.isLoading = false
      })
      .addCase(allDepartments.rejected, (state, action) => {
        state.message = action.payload
        state.isError = true
        state.isLoading = false
      })
      .addCase(employeesByDepartment.pending, (state) => {
        state.isLoading = true
      })
      .addCase(employeesByDepartment.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.isSuccess = true
        state.employeesByDepartmentData = action.payload
        state.isLoading = false
      })
      .addCase(employeesByDepartment.rejected, (state, action) => {
        state.message = action.payload
        state.isError = true
        state.isLoading = false
      })
  },
})

export const { logoutUser, clearState } = employeeSlice.actions
export default employeeSlice.reducer
