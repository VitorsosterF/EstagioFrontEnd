import axios from "axios"
import { obterToken } from "./auth"

export const api = axios.create
({
    baseURL: "http://localhost:8080"
})

api.interceptors.request.use(config => 
{
    const token = obterToken()
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})