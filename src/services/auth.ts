import { api } from "./api"

interface RespostaLogin {
    token: string
    id: number
    nome: string
    sobrenome: string
    perfil: string
}

export async function login(email: string, senha: string): Promise<{ token: string, nomeCompleto: string }> {
    const resposta = await api.post<RespostaLogin>("/auth/login", { email, senha })
    const { token, id, nome, sobrenome, perfil } = resposta.data
    localStorage.setItem("nomeUsuario", `${nome} ${sobrenome}`)
    localStorage.setItem("usuarioId", String(id))
    localStorage.setItem("perfil", perfil)
    localStorage.setItem("token", token)
    return { token, nomeCompleto: `${nome} ${sobrenome}` }
}

export function obterNomeUsuario(): string {
    return localStorage.getItem("nomeUsuario") ?? ""
}

export function obterPerfil(): string {
    return localStorage.getItem("perfil") ?? ""
}

export function ehAdmin(): boolean {
    return obterPerfil().toLowerCase() === "admin"
}

export function removerToken() {
    localStorage.removeItem("token")
    localStorage.removeItem("nomeUsuario")
    localStorage.removeItem("usuarioId")
    localStorage.removeItem("perfil")
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
