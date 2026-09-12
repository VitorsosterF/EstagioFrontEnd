import type { UsuarioResumo } from "./usuarios"

export interface Obra {
    id?: number
    nome: string
    rua: string
    numero: string
    complemento: string
    cliente?: UsuarioResumo
    clienteId: number | ""
    status: string
    descricao: string
    criadoEm?: string
    imagemUrl?: string
}
