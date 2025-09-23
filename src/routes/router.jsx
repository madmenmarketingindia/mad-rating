import { Navigate, Route, Routes } from 'react-router-dom'
import AuthLayout from '@/layouts/AuthLayout'
import AdminLayout from '@/layouts/AdminLayout'
import { appRoutes, authRoutes } from '@/routes/index'

const AppRouter = (props) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const isAuthenticated = true
  const role = user?.data?.user?.role || 'Employee'

  const allowedAppRoutes = (appRoutes || []).filter((route) => !route.roles || route.roles.includes(role))

  return (
    <Routes>
      {(authRoutes || []).map((route, idx) => (
        <Route key={idx + route.name} path={route.path} element={<AuthLayout {...props}>{route.element}</AuthLayout>} />
      ))}

      {/* Protected App routes */}
      {allowedAppRoutes.map((route, idx) => (
        <Route
          key={idx + route.name}
          path={route.path}
          element={
            isAuthenticated ? (
              <AdminLayout {...props}>{route.element}</AdminLayout>
            ) : (
              <Navigate
                to={{
                  pathname: '/auth/sign-in',
                  search: 'redirectTo=' + route.path,
                }}
              />
            )
          }
        />
      ))}

      {/* Catch-all route for unauthorized access */}
      <Route path="*" element={<Navigate to={isAuthenticated ? '/dashboard/analytics' : '/auth/sign-in'} />} />
    </Routes>
  )
}

export default AppRouter
