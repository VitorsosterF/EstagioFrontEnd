import { api } from "./api"

export async function login(email: string, senha: string): Promise<string> {
    const resposta = await api.post("/auth/login", { email, senha })
    return resposta.data.token
}

export function salvarToken(token: string) {
    localStorage.setItem("token", token)
}

export function obterToken(): string | null {
    return localStorage.getItem("token")
}

export function removerToken() {
    localStorage.removeItem("token")
}

export function estaAutenticado(): boolean {
    return !!obterToken()
}