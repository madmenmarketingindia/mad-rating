import { BASE_URL, getConfig } from '../../../utils/axiosConfig'
import axiosInstance from '@/utils/axiosInstance'

const getDepartmentStats = async (data) => {
  const config = await getConfig()
  const response = await axiosInstance.get(`${BASE_URL}/d/department-stats`, config)
  return response.data
}

const getDepartmentRating = async (data) => {
  const config = await getConfig()
  const response = await axiosInstance.get(`${BASE_URL}/d/department-rating`, config)
  return response.data
}

const getEmployeeUpcomingBirthday = async (data) => {
  const config = await getConfig()
  const response = await axiosInstance.get(`${BASE_URL}/d/birthdays`, config)
  return response.data
}

const getEmployeeWorkAnniversary = async (data) => {
  const config = await getConfig()
  const response = await axiosInstance.get(`${BASE_URL}/d/workAnniversary`, config)
  return response.data
}

const getEmployeeMonthlyRating = async () => {
  const config = await getConfig()

  const response = await axiosInstance.get(`${BASE_URL}/d/employee`, config)
  return response.data
}

const getEmployeeYearlyRatings = async () => {
  const config = await getConfig()

  const response = await axiosInstance.get(`${BASE_URL}/d/employee-yearly-ratings`, config)
  return response.data
}

export {
  getDepartmentStats,
  getDepartmentRating,
  getEmployeeUpcomingBirthday,
  getEmployeeWorkAnniversary,
  getEmployeeMonthlyRating,
  getEmployeeYearlyRatings,
}
