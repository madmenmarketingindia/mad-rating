import { lazy } from 'react'
import { Navigate } from 'react-router-dom'

// Dashboard Routes
const Analytics = lazy(() => import('@/app/(admin)/dashboard/analytics/page'))

// User Routes
const UserList = lazy(() => import('@/app/(admin)/users/users-list/page'))
const CreateUser = lazy(() => import('@/app/(admin)/users/create-user/page'))

// Employees Rotes
const EmployeesList = lazy(() => import('@/app/(admin)/employees/employees-list/page'))
const EmployeesCreate = lazy(() => import('@/app/(admin)/employees/employees-create/page'))
const EmployeesProfile = lazy(() => import('@/app/(admin)/employees/employee-profile/page'))
const Profile = lazy(() => import('@/app/(admin)/profile/page'))

//rating and report
const RatingsReports = lazy(() => import('@/app/(admin)/ratings-report/page'))
const RatingsEdits = lazy(() => import('@/app/(admin)/ratings-report/add-rating/page'))

// employee payroll
const EmployeePayrollList = lazy(() => import('@/app/(admin)/employee-payroll/page'))
const UpsertEmployeePayroll = lazy(() => import('@/app/(admin)/employee-payroll/create-payroll/page'))

// employee salary
const EmployeeSalaryList = lazy(() => import('@/app/(admin)//salary/page'))
const EmployeeSalaryDetail = lazy(() => import('@/app/(admin)//salary/salary-details/page'))
const EmployeeDashboard = lazy(() => import('@/app/(employee)/dashboard/page'))

//disciplinary Actions
const DisciplinaryActionsList = lazy(() => import('@/app/(admin)/disciplinary-actions/page'))
const DisciplinaryActionsCreate = lazy(() => import('@/app/(admin)/disciplinary-actions/disciplinary-actions-create/page'))

// Pages Routes
const Welcome = lazy(() => import('@/app/(admin)/pages/welcome/page'))
const ComingSoon = lazy(() => import('@/app/(other)/coming-soon/page'))
const Maintenance = lazy(() => import('@/app/(other)/maintenance/page'))

// Not Found Routes
const NotFoundAdmin = lazy(() => import('@/app/(admin)/not-found'))
const NotFound = lazy(() => import('@/app/(other)/(error-pages)/error-404/page'))

// Auth Routes
const AuthSignIn2 = lazy(() => import('@/app/(other)/auth/sign-in-2/page'))
const AuthSignUp2 = lazy(() => import('@/app/(other)/auth/sign-up-2/page'))
const ResetPassword2 = lazy(() => import('@/app/(other)/auth/reset-pass-2/page'))
const LockScreen2 = lazy(() => import('@/app/(other)/auth/lock-screen-2/page'))
const initialRoutes = [
  {
    path: '/',
    name: 'root',
    element: <Navigate to="/dashboard/analytics" />,
  },
]
const generalRoutes = [
  {
    path: '/dashboard/analytics',
    name: 'Analytics',
    element: <Analytics />,
    roles: ['Admin', 'HR', 'Employee'],
  },

  {
    path: '/users/users-list',
    name: 'Users',
    element: <UserList />,
    roles: ['Admin', 'Employee'],
  },

  {
    path: '/users/create-user',
    name: 'Users',
    element: <CreateUser />,
    roles: ['Admin', 'Employee'],
  },

  {
    path: '/employees/employees-list',
    name: 'Employees',
    element: <EmployeesList />,
    roles: ['Admin', 'Employee'],
  },

  {
    path: '/employees/employees-create',
    name: 'Employees',
    element: <EmployeesCreate />,
    roles: ['Admin', 'Employee'],
  },

  {
    path: '/employees/employees-create',
    name: 'Employees',
    element: <EmployeesCreate />,
    roles: ['Admin', 'Employee'],
  },

  {
    path: '/employees/employees-profile',
    name: 'Employees',
    element: <EmployeesProfile />,
    roles: ['Admin', 'Employee'],
  },

  {
    path: '/ratings-reports/list',
    name: 'RatingsReports',
    element: <RatingsReports />,
    roles: ['Admin', 'Employee'],
  },

  {
    path: '/ratings-report/add-rating',
    name: 'RatingsReports',
    element: <RatingsEdits />,
    roles: ['Admin', 'Employee'],
  },

  {
    path: '/employee-payroll/list',
    name: 'employeePayroll',
    element: <EmployeePayrollList />,
    roles: ['Admin', 'Employee'],
  },

  {
    path: '/employee-payroll/create-payroll',
    name: 'employeePayroll',
    element: <UpsertEmployeePayroll />,
    roles: ['Admin', 'Employee'],
  },

  {
    path: '/employee-payroll/salary-list',
    name: 'employeeSalary',
    element: <EmployeeSalaryList />,
    roles: ['Admin', 'Employee'],
  },

  {
    path: '/employee-payroll/salary-list/detail',
    name: 'employeeSalary',
    element: <EmployeeSalaryDetail />,
    roles: ['Admin', 'Employee'],
  },

  {
    path: '/dashboard/em/analytics',
    name: 'employeeSalary',
    element: <EmployeeDashboard />,
    roles: ['Employee'],
  },

  {
    path: '/dashboard/em/profile',
    name: 'employeeSalary',
    element: <EmployeeDashboard />,
    roles: ['Employee'],
  },

  {
    path: '/profile/me',
    name: 'profile',
    element: <Profile />,
    roles: ['Admin', 'Hr', 'Employee'],
  },

  {
    path: '/disciplinary-actions/list',
    name: 'disciplinaryActions',
    element: <DisciplinaryActionsList />,
    roles: ['Admin', 'Hr'],
  },

  {
    path: '/disciplinary-actions/list/create',
    name: 'disciplinaryActions',
    element: <DisciplinaryActionsCreate />,
    roles: ['Admin', 'Hr'],
  },
]

const customRoutes = [
  {
    name: 'Welcome',
    path: '/pages/welcome',
    element: <Welcome />,
  },

  {
    name: 'Error 404 Alt',
    path: '/pages/error-404-alt',
    element: <NotFoundAdmin />,
  },
]

export const authRoutes = [
  {
    name: 'Sign In',
    path: '/auth/sign-in',
    element: <AuthSignIn2 />,
  },
  {
    name: 'Sign Up',
    path: '/auth/sign-up',
    element: <AuthSignUp2 />,
  },
  {
    name: 'Reset Password',
    path: '/auth/reset-pass',
    element: <ResetPassword2 />,
  },
  {
    name: 'Lock Screen',
    path: '/auth/lock-screen',
    element: <LockScreen2 />,
  },
  {
    name: '404 Error',
    path: '/error-404',
    element: <NotFound />,
  },
  {
    path: '*',
    name: 'not-found',
    element: <NotFound />,
  },
  {
    name: 'Maintenance',
    path: '/maintenance',
    element: <Maintenance />,
  },
  {
    name: 'Coming Soon',
    path: '/coming-soon',
    element: <ComingSoon />,
  },
]
export const appRoutes = [...initialRoutes, ...generalRoutes, , ...customRoutes, ...authRoutes]
