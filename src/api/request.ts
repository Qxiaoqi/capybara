import axios from "axios"

const request = axios.create({
  baseURL: "http://localhost:3000/api/",
})

request.interceptors.request.use((config) => {
  return config
})

request.interceptors.response.use(
  (response) => {
    return response?.data
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default request
