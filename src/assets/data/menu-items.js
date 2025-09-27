export const MENU_ITEMS = [
  {
    key: 'menu',
    label: 'MENU',
    isTitle: true,
  },
  {
    key: 'dashboard',
    icon: 'mdi:view-dashboard-outline',
    label: 'Dashboard',
    badge: {
      variant: 'success',
    },
    url: '/dashboard/analytics',
    roles: ['Admin', 'HR', 'Employee'],
  },

  {
    key: 'users',
    icon: 'mdi:account-multiple-outline',
    label: 'User',
    badge: {
      variant: 'success',
    },
    url: '/users/users-list',
    roles: ['Admin', 'HR'],
  },

  {
    key: 'employees',
    icon: 'mdi:account-tie-outline',
    label: 'Employees',
    badge: {
      variant: 'success',
    },
    url: '/employees/employees-list',
    roles: ['Admin', 'HR'],
  },

  {
    key: 'RatingsReports',
    icon: 'mdi:star-check-outline',
    label: 'Ratings Reports',
    badge: {
      variant: 'success',
    },
    url: '/ratings-reports/list',
    roles: ['Admin', 'HR'],
  },

  {
    key: 'EmployeePayroll',
    icon: 'mdi:currency-inr',
    label: 'Employee Payroll',
    badge: {
      variant: 'success',
    },
    url: '/employee-payroll/list',
    roles: ['Admin', 'HR'],
  },

  {
    key: 'profile',
    icon: 'mdi:account-circle-outline',
    label: 'Profile',
    badge: {
      variant: 'success',
    },
    url: '/profile/me',
    roles: ['Employee'],
  },

  {
    key: 'disciplinaryActions',
    icon: 'mdi:alert-circle-outline',
    label: 'Disciplinary Actions',
    badge: {
      variant: 'success',
    },
    url: '/disciplinary-actions/list',
    roles: ['Admin', 'Hr'],
  },

  {
    key: 'teamsPerformance',
    icon: 'mdi:chart-line',
    label: 'Teams Performance',
    badge: {
      variant: 'success',
    },
    url: '/teams-performance/list',
    roles: ['Admin', 'Hr'],
  },

  {
    key: 'teamsIncentive',
    icon: 'mdi:finance',
    label: 'Teams Incentive',
    badge: {
      variant: 'success',
    },
    url: '/teams-incentive/list',
    roles: ['Admin', 'Hr'],
  },

  {
    key: 'holiday',
    icon: 'mdi:calendar-star',
    label: 'Holidays',
    badge: {
      variant: 'success',
    },
    url: '/holiday/list',
    roles: ['Admin', 'Hr'],
  },
]
