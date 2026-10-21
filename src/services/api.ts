import axios from "axios"
import { obterToken, removerToken } from "./auth"

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

// Sessão persiste entre reloads via token salvo; se o token expirou ou foi
// revogado, o back responde 401 e aqui a gente limpa a sessão e manda pro login.
api.interceptors.response.use(
    resposta => resposta,
    erro => {
        if (erro.response?.status === 401) {
            removerToken()
            window.location.href = "/login"
        }
        return Promise.reject(erro)
    }
)