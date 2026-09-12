export interface Usuario
{
    id?: number
    nome: string
    sobrenome: string
    email: string
    senha: string
    perfil: string
}

// Formato reduzido devolvido pelo back quando o usuário aparece embutido em
// outro recurso (ex.: obra.cliente) — sem a senha.
export interface UsuarioResumo
{
    id: number
    nome: string
    sobrenome: string
    email: string
    perfil: string
}
