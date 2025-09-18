import { configureStore } from '@reduxjs/toolkit'
import userReducer from './features/user/userSlice'
import employeeReducer from './features/employee/employeeSlice'
import ratingReportReducer from './features/ratingReport/ratingReportSlice'
import attendancePayrollReducer from './features/attendancePayroll/attendancePayrollSlice'
import salaryReducer from './features/salary/salarySlice'
import dashboardReducer from './features/dashboard/dashboardSlice'
import disciplinaryActionsReducer from './features/disciplinaryActions/disciplinaryActionsSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    employee: employeeReducer,
    ratingReport: ratingReportReducer,
    attendancePayroll: attendancePayrollReducer,
    salary: salaryReducer,
    dashboard: dashboardReducer,
    disciplinaryActions: disciplinaryActionsReducer,
  },
})

export const RootState = () => store.getState()
export const AppDispatch = () => store.dispatch
