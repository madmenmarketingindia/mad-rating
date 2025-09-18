export const MENU_ITEMS = [
  {
    key: 'menu',
    label: 'MENU',
    isTitle: true,
  },
  {
    key: 'dashboard',
    icon: 'solar:home-2-broken',
    label: 'Dashboard',
    badge: {
      variant: 'success',
    },
    url: '/dashboard/analytics',
    roles: ['Admin', 'HR', 'Employee'],
  },

  {
    key: 'users',
    icon: 'solar:home-2-broken',
    label: 'User',
    badge: {
      variant: 'success',
    },
    url: '/users/users-list',
    roles: ['Admin', 'HR'],
  },

  {
    key: 'employees',
    icon: 'solar:home-2-broken',
    label: 'Employees',
    badge: {
      variant: 'success',
    },
    url: '/employees/employees-list',
    roles: ['Admin', 'HR'],
  },

  {
    key: 'RatingsReports',
    icon: 'solar:home-2-broken',
    label: 'Ratings Reports',
    badge: {
      variant: 'success',
    },
    url: '/ratings-reports/list',
    roles: ['Admin', 'HR'],
  },

  {
    key: 'EmployeePayroll',
    icon: 'solar:home-2-broken',
    label: 'Employee Payroll',
    badge: {
      variant: 'success',
    },
    url: '/employee-payroll/list',
    roles: ['Admin', 'HR'],
  },

  {
    key: 'profile',
    icon: 'solar:home-2-broken',
    label: 'Profile',
    badge: {
      variant: 'success',
    },
    url: '/profile/me',
    roles: ['Employee'],
  },

  {
    key: 'disciplinaryActions',
    icon: 'solar:home-2-broken',
    label: 'Disciplinary Actions',
    badge: {
      variant: 'success',
    },
    url: '/disciplinary-actions/list',
    roles: ['Admin', 'Hr'],
  },
]
