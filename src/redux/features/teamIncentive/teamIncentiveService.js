import { BASE_URL, getConfig } from '../../../utils/axiosConfig'
import axiosInstance from '@/utils/axiosInstance'

const getAllTeamIncentive = async (filters = {}) => {
  const config = await getConfig()
  const response = await axiosInstance.get(`${BASE_URL}/team/get-all-incentive`, {
    ...config,
    params: filters,
  })

  return response.data
}

const createTeamWiseIncentive = async (incentiveData) => {
  const config = await getConfig()
  const response = await axiosInstance.post(`${BASE_URL}/team/add-team-incentive`, incentiveData, {
    ...config,
  })

  return response.data
}

const editTeamWiseIncentive = async (incentiveId, incentiveData) => {
  const config = await getConfig()
  const response = await axiosInstance.put(
    `${BASE_URL}/team/update-incentive/${incentiveId}`,
    incentiveData, // ✅ only data here
    config,
  )
  return response.data
}

const getSingleTeamIncentive = async (incentiveId) => {
  const config = await getConfig()
  const response = await axiosInstance.get(`${BASE_URL}/team/incentive/${incentiveId}`, {
    ...config,
  })

  return response.data
}

const deleteTeamWiseIncentive = async (incentiveId) => {
  const config = await getConfig()
  const response = await axiosInstance.delete(`${BASE_URL}/team/delete-incentive/${incentiveId}`, config)
  return response.data
}

const getSingleMemberIncentive = async (employeeId, filters) => {
  const config = await getConfig()
  const response = await axiosInstance.get(`${BASE_URL}/team/single-member-incentive/${employeeId}`, {
    ...config,
    params: filters,
  })

  return response.data
}

export {
  getAllTeamIncentive,
  createTeamWiseIncentive,
  editTeamWiseIncentive,
  getSingleTeamIncentive,
  deleteTeamWiseIncentive,
  getSingleMemberIncentive,
}
