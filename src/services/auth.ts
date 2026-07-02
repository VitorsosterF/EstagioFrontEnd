import { api } from "./api"

export async function login(email: string, senha: string): Promise<{ token: string, nomeCompleto: string }> {
    const resposta = await api.post("/auth/login", { email, senha })
    const { token, nome, sobrenome } = resposta.data
    localStorage.setItem("nomeUsuario", `${nome} ${sobrenome}`)
    localStorage.setItem("token", token)
    console.log("resposta do back:", resposta.data)
    return { token, nomeCompleto: `${nome} ${sobrenome}` }
}

export function obterNomeUsuario(): string {
    return localStorage.getItem("nomeUsuario") ?? ""
}

export function removerToken() {
    localStorage.removeItem("token")
    localStorage.removeItem("nomeUsuario")
}

export function salvarToken(token: string) {
    localStorage.setItem("token", token)
}

export function obterToken(): string | null {
    return localStorage.getItem("token")
}

export function estaAutenticado(): boolean {
    return !!obterToken()
}