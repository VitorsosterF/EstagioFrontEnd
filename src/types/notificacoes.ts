import type { Obra } from "./obras"
import type { Template } from "./templates"

export interface Notificacao {
    id: number
    mensagem: string
    dataCriacao: string
    lida: boolean
    obra: Obra
    template: Template
}
