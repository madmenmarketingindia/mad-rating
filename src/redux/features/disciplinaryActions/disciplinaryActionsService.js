import { BASE_URL, getConfig } from '../../../utils/axiosConfig'
import axiosInstance from '@/utils/axiosInstance'

const getAllDisciplinaryActions = async (filters) => {
  const config = await getConfig()
  const response = await axiosInstance.get(`${BASE_URL}/disciplinary/get-all`, {
    ...config,
    params: filters,
  })

  return response.data
}

const editDisciplinaryActionStatus = async (actionId, data) => {
  const config = await getConfig()
  const response = await axiosInstance.put(`${BASE_URL}/disciplinary/update/${actionId}`, data, config)
  return response.data
}

const adminCreateDisciplinaryAction = async (data) => {
  const config = await getConfig()
  const response = await axiosInstance.post(`${BASE_URL}/disciplinary/create`, data, config)

  return response.data
}

const getSingleDisciplinaryAction = async (actionId) => {
  const config = await getConfig()
  const response = await axiosInstance.get(`${BASE_URL}/disciplinary/get-single/${actionId}`, config)
  return response.data
}

const getEmployeeDisciplinaryActions = async () => {
  const config = await getConfig()
  const response = await axiosInstance.get(`${BASE_URL}/disciplinary/employee`, config)
  return response.data
}

const getUpcomingReviews = async () => {
  const config = await getConfig()
  const response = await axiosInstance.get(`${BASE_URL}/disciplinary/upComingReviews`, config)
  return response.data
}

export {
  getAllDisciplinaryActions,
  editDisciplinaryActionStatus,
  adminCreateDisciplinaryAction,
  getSingleDisciplinaryAction,
  getEmployeeDisciplinaryActions,
  getUpcomingReviews,
}
