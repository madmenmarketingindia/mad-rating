import axios from 'axios'
import { BASE_URL, getConfig } from '../../../utils/axiosConfig'
import axiosInstance from '@/utils/axiosInstance'

// get all users
const getAllEmployee = async () => {
  const config = await getConfig()
  const response = await axiosInstance.get(`${BASE_URL}/employee/get-all`, config)
  return response.data
}

// register a user
const createEmployee = async (employeeData) => {
  const response = await axiosInstance.post(`${BASE_URL}/employee/create`, employeeData)
  return response.data
}

// edit user
const editEmployee = async (employeeData) => {
  const config = await getConfig()
  const response = await axiosInstance.put(`${BASE_URL}/employee/${employeeData.id}`, employeeData, config)
  return response.data
}

const deleteEmployeeByAdmin = async (employeeId) => {
  const config = await getConfig()
  const response = await axiosInstance.delete(`${BASE_URL}/employee/${employeeId}`, config)
  return response.data
}

const getEmployee = async (userId) => {
  const config = await getConfig()
  const response = await axiosInstance.get(`${BASE_URL}/employee/${userId}`, config)
  return response.data
}

const getEmployeeProfile = async (employeeId) => {
  const config = await getConfig()
  const response = await axiosInstance.get(`${BASE_URL}/employee/employee-profile/${employeeId}`, config)
  return response.data
}

const userStatus = async (userData) => {
  const config = await getConfig()
  const response = await axiosInstance.patch(`${BASE_URL}/user/active`, userData, config)
  return response.data
}

const getAllDepartments = async () => {
  const config = await getConfig()
  const response = await axiosInstance.get(`${BASE_URL}/employee/all-department`, config)
  return response.data
}

const getEmployeesByDepartment = async (departmentName) => {
  const config = await getConfig()
  const response = await axiosInstance.get(`${BASE_URL}/employee/by-department?department=${departmentName}`, config)
  return response.data
}

export {
  createEmployee,
  editEmployee,
  getEmployeeProfile,
  deleteEmployeeByAdmin,
  getAllEmployee,
  getEmployee,
  userStatus,
  getAllDepartments,
  getEmployeesByDepartment,
}
