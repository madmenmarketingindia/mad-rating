import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { createUser, deleteUserByAdmin, editUser, getAllUsers, getUser, LoginInUser, userStatus } from './userService'

const initialState = {
  user: null,
  isAuthenticated: false,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
  allUsers: [],
  usersRegister: null,
  updatedUser: null,
  deletedUser: null,
  getUserData: {},
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
export const getUsers = createAsyncThunk('user/get-all', async (_, thunkAPI) => {
  try {
    const response = await getAllUsers()
    return response
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Fetch users failed'
    return thunkAPI.rejectWithValue(message)
  }
})

// register a user by admin
export const registerUser = createAsyncThunk('user/register', async (userdata, thunkAPI) => {
  try {
    const response = await createUser(userdata)
    return response
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Registration failed'
    return thunkAPI.rejectWithValue(message)
  }
})

export const updateUser = createAsyncThunk('user/update-user', async (userData, thunkAPI) => {
  try {
    return await editUser(userData)
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message)
  }
})

export const deleteUser = createAsyncThunk('user/delete-user', async (userId, thunkAPI) => {
  try {
    return await deleteUserByAdmin(userId)
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message)
  }
})

export const getUserById = createAsyncThunk('user/get-userId', async (userId, thunkAPI) => {
  try {
    return await getUser(userId)
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

export const userSlice = createSlice({
  name: 'user',
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
      .addCase(login.pending, (state) => {
        state.isLoading = true
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload
        state.isAuthenticated = true
        state.loginData = action.payload
        state.isSuccess = true
        state.isLoading = false
      })
      .addCase(login.rejected, (state, action) => {
        state.message = action.payload
        state.isError = true
        state.isLoading = false
      })
      .addCase(getUsers.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.isSuccess = true
        state.allUsers = action.payload
        state.isLoading = false
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.message = action.payload
        state.isError = true
        state.isLoading = false
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.isSuccess = true
        state.usersRegister = action.payload
        state.isLoading = false
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.message = action.payload
        state.isError = true
        state.isLoading = false
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.isSuccess = true
        state.updatedUser = action.payload
        state.isLoading = false
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.message = action.payload
        state.isError = true
        state.isLoading = false
      })
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.isSuccess = true
        state.deletedUser = action.payload
        state.isLoading = false
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.message = action.payload
        state.isError = true
        state.isLoading = false
      })
      .addCase(getUserById.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.isSuccess = true
        state.getUserData = action.payload
        state.isLoading = false
      })
      .addCase(getUserById.rejected, (state, action) => {
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
  },
})

export const { logoutUser, clearState } = userSlice.actions
export default userSlice.reducer
