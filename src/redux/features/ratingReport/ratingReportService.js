import { BASE_URL, getConfig } from '../../../utils/axiosConfig'
import axiosInstance from '@/utils/axiosInstance'

const getEmployeeWiseRatingReport = async () => {
  const config = await getConfig()
  const response = await axiosInstance.get(`${BASE_URL}/rating/employee-wise`, config)
  return response.data
}

const createEmployeeRating = async (ratingData) => {
  const response = await axiosInstance.post(`${BASE_URL}/rating/upsert`, ratingData)
  return response.data
}

const getSingleMonthRating = async ({ employeeId, month, year }) => {
  const response = await axiosInstance.get(`${BASE_URL}/rating/single-month-rating/${employeeId}`, {
    params: { month, year },
  })
  return response.data
}

const getRatingHistory = async (employeeId) => {
  const config = await getConfig()
  const response = await axiosInstance.get(`${BASE_URL}/rating/employee-history/${employeeId}`, config)
  return response.data
}

const getEmployeeYearlyRatings = async ({ employeeId, month, year }) => {
  const response = await axiosInstance.get(`${BASE_URL}/rating/yearly-rating/${employeeId}`, {
    params: { month, year },
  })
  return response.data
}

export { getEmployeeWiseRatingReport, createEmployeeRating, getSingleMonthRating, getRatingHistory, getEmployeeYearlyRatings }
