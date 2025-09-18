import axios from 'axios'
import { BASE_URL, getConfig } from '../../../utils/axiosConfig'
import axiosInstance from '@/utils/axiosInstance'

// login user and admin
const LoginInUser = async (userData) => {
  const response = await axios.post(`${BASE_URL}/user/login`, userData, {})
  return response.data
}

// get all users
const getAllUsers = async () => {
  const config = await getConfig()
  const response = await axiosInstance.get(`${BASE_URL}/user/get-all`, config)
  return response.data
}

// register a user
const createUser = async (userData) => {
  const response = await axiosInstance.post(`${BASE_URL}/user/create`, userData)
  return response.data
}

// edit user
const editUser = async (userData) => {
  const config = await getConfig()
  const response = await axiosInstance.put(`${BASE_URL}/user/${userData.id}`, userData, config)
  return response.data
}

const deleteUserByAdmin = async (userId) => {
  const config = await getConfig()
  const response = await axiosInstance.delete(`${BASE_URL}/user/${userId}`, config)
  return response.data
}

const getUser = async (userId) => {
  const config = await getConfig()
  const response = await axiosInstance.get(`${BASE_URL}/user/${userId}`, config)
  return response.data
}

const userStatus = async (userData) => {
  const config = await getConfig()
  const response = await axiosInstance.patch(`${BASE_URL}/user/active`, userData, config)
  return response.data
}

export { createUser, deleteUserByAdmin, editUser, getAllUsers, LoginInUser, getUser, userStatus }
