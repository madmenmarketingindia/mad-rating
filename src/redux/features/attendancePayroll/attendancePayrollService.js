import { BASE_URL, getConfig } from '../../../utils/axiosConfig'
import axiosInstance from '@/utils/axiosInstance'

const getListPayrollByEmployees = async (filters) => {
  const config = await getConfig()

  const response = await axiosInstance.get(`${BASE_URL}/attendancePayroll/payroll-list`, {
    ...config,
    params: filters,
  })

  return response.data
}

const upsertPayrollEmployee = async (upsertPayrollData) => {
  const response = await axiosInstance.post(`${BASE_URL}/attendancePayroll/upsert`, upsertPayrollData)
  return response.data
}

const getSinglePayrollEmployee = async (employeeId, filters) => {
  const config = await getConfig()
  const response = await axiosInstance.get(`${BASE_URL}/attendancePayroll/payroll/${employeeId}`, {
    ...config,
    params: filters,
  })
  return response.data
}

const employeeCalculateIncentive = async (employeeId, filters) => {
  const config = await getConfig()
  const response = await axiosInstance.get(`${BASE_URL}/attendancePayroll/incentive/${employeeId}`, {
    ...config,
    params: filters,
  })
  return response.data
}

const exportEmployeesPayrollAdmin = async (month, year) => {
  const config = await getConfig()
  const response = await axiosInstance.get(`${BASE_URL}/export/employees-payroll?month=${month}&year=${year}`, {
    ...config,
    responseType: 'blob',
  })
  return response.data
}

export { getListPayrollByEmployees, upsertPayrollEmployee, getSinglePayrollEmployee, employeeCalculateIncentive, exportEmployeesPayrollAdmin }
