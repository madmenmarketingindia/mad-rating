import { BASE_URL, getConfig } from '../../../utils/axiosConfig'
import axiosInstance from '@/utils/axiosInstance'

const getSalaryByEmployeeAndYear = async (employeeId, filters) => {
  const config = await getConfig()
  const response = await axiosInstance.get(`${BASE_URL}/salary/list/${employeeId}`, {
    ...config,
    params: filters,
  })

  return response.data
}

const getEmployeeSalaryDetail = async (employeeId, filters) => {
  const config = await getConfig()
  const response = await axiosInstance.get(`${BASE_URL}/salary/employee/${employeeId}`, {
    ...config,
    params: filters,
  })

  return response.data
}

const adminDownloadSalarySlip = async (employeeId, filters) => {
  const config = await getConfig()
  const response = await axiosInstance.get(
    `${BASE_URL}/salary/download-salary-slip/${employeeId}`,
    {
      ...config,
      params: filters,
      responseType: 'blob',
    }
  )

  return response
}

export { getSalaryByEmployeeAndYear, getEmployeeSalaryDetail, adminDownloadSalarySlip }
