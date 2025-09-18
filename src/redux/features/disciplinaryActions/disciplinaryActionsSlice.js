import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  adminCreateDisciplinaryAction,
  editDisciplinaryActionStatus,
  getAllDisciplinaryActions,
  getEmployeeDisciplinaryActions,
  getSingleDisciplinaryAction,
  getUpcomingReviews,
} from './disciplinaryActionsService'

const initialState = {
  disciplinaryActionsData: [],
  createdDisciplinaryAction: {},
  singleDisciplinaryActionData: {},
  employeeDisciplinaryActionsData: {},
  upcomingReviewsData: {},
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

export const getDisciplinaryActions = createAsyncThunk('disciplinary-actions/get-all', async (filters, thunkAPI) => {
  try {
    const response = await getAllDisciplinaryActions(filters)
    return response
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Fetch disciplinary Actions Rating Report failed'
    return thunkAPI.rejectWithValue(message)
  }
})

export const updateDisciplinaryActionStatus = createAsyncThunk('disciplinary-actions/update', async ({ actionId, data }, thunkAPI) => {
  try {
    const response = await editDisciplinaryActionStatus(actionId, data)
    return response
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Update disciplinary action failed'
    return thunkAPI.rejectWithValue(message)
  }
})

export const createDisciplinaryAction = createAsyncThunk('disciplinary-actions/create', async (data, thunkAPI) => {
  try {
    const response = await adminCreateDisciplinaryAction(data)
    return response
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Create disciplinary Actions Rating Report failed'
    return thunkAPI.rejectWithValue(message)
  }
})

export const singleDisciplinaryAction = createAsyncThunk('disciplinary-actions/get-single', async (actionId, thunkAPI) => {
  try {
    const response = await getSingleDisciplinaryAction(actionId)
    return response
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Create disciplinary Actions Rating Report failed'
    return thunkAPI.rejectWithValue(message)
  }
})

export const employeeDisciplinaryActions = createAsyncThunk('disciplinary-actions/employee', async (_, thunkAPI) => {
  try {
    const response = await getEmployeeDisciplinaryActions()
    return response
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Create disciplinary Actions Rating Report failed'
    return thunkAPI.rejectWithValue(message)
  }
})

export const upcomingReviews = createAsyncThunk('disciplinary-actions/upcoming', async (_, thunkAPI) => {
  try {
    const response = await getUpcomingReviews()
    return response
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'upcoming disciplinary Actions Rating Report failed'
    return thunkAPI.rejectWithValue(message)
  }
})

export const disciplinaryActionsSlice = createSlice({
  name: 'disciplinaryActions',
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
      .addCase(getDisciplinaryActions.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getDisciplinaryActions.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.isSuccess = true
        state.disciplinaryActionsData = { data: action.payload.data || action.payload || [] }
        state.isLoading = false
      })
      .addCase(getDisciplinaryActions.rejected, (state, action) => {
        state.message = action.payload
        state.isError = true
        state.isLoading = false
      })
      .addCase(updateDisciplinaryActionStatus.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateDisciplinaryActionStatus.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.isSuccess = true
        state.disciplinaryActionsData = action.payload
        state.isLoading = false
      })
      .addCase(updateDisciplinaryActionStatus.rejected, (state, action) => {
        state.message = action.payload
        state.isError = true
        state.isLoading = false
      })
      .addCase(createDisciplinaryAction.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createDisciplinaryAction.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.isSuccess = true
        state.createdDisciplinaryAction = action.payload
        state.isLoading = false
      })
      .addCase(createDisciplinaryAction.rejected, (state, action) => {
        state.message = action.payload
        state.isError = true
        state.isLoading = false
      })
      .addCase(singleDisciplinaryAction.pending, (state) => {
        state.isLoading = true
      })
      .addCase(singleDisciplinaryAction.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.isSuccess = true
        state.singleDisciplinaryActionData = action.payload
        state.isLoading = false
      })
      .addCase(singleDisciplinaryAction.rejected, (state, action) => {
        state.message = action.payload
        state.isError = true
        state.isLoading = false
      })
      .addCase(employeeDisciplinaryActions.pending, (state) => {
        state.isLoading = true
      })
      .addCase(employeeDisciplinaryActions.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.isSuccess = true
        state.employeeDisciplinaryActionsData = action.payload
        state.isLoading = false
      })
      .addCase(employeeDisciplinaryActions.rejected, (state, action) => {
        state.message = action.payload
        state.isError = true
        state.isLoading = false
      })
      .addCase(upcomingReviews.pending, (state) => {
        state.isLoading = true
      })
      .addCase(upcomingReviews.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.isSuccess = true
        state.upcomingReviewsData = action.payload
        state.isLoading = false
      })
      .addCase(upcomingReviews.rejected, (state, action) => {
        state.message = action.payload
        state.isError = true
        state.isLoading = false
      })
  },
})

export const { logoutUser, clearState } = disciplinaryActionsSlice.actions
export default disciplinaryActionsSlice.reducer
