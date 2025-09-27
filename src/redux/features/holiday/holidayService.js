import { BASE_URL, getConfig } from '../../../utils/axiosConfig'
import axiosInstance from '@/utils/axiosInstance'

const getAllHoliday = async () => {
  const config = await getConfig()
  const response = await axiosInstance.get(`${BASE_URL}/holiday/get-all`, {
    ...config,
  })

  return response.data
}

const createHolidayByAdmin = async (HolidaysData) => {
  const config = await getConfig()
  const response = await axiosInstance.post(`${BASE_URL}/holiday/create`, HolidaysData, {
    ...config,
  })

  return response.data
}

const updatedHoliday = async (holidayId, holidayData) => {
  const config = await getConfig()
  const response = await axiosInstance.put(`${BASE_URL}/holiday/update/${holidayId}`, holidayData, config)
  return response.data
}

const getSingleHoliday = async (holidayId) => {
  const config = await getConfig()
  const response = await axiosInstance.get(`${BASE_URL}/holiday/get-one/${holidayId}`, {
    ...config,
  })
  return response.data
}

const deleteHolidayByAdmin = async (holidayId) => {
  const config = await getConfig()
  const response = await axiosInstance.delete(`${BASE_URL}/holiday/delete/${holidayId}`, config)
  return response.data
}

const getHolidaysByMonthByAll = async () => {
  const config = await getConfig()
  const response = await axiosInstance.get(`${BASE_URL}/holiday/month`, config)
  return response.data
}

export { getAllHoliday, createHolidayByAdmin, updatedHoliday, getSingleHoliday, deleteHolidayByAdmin, getHolidaysByMonthByAll }
