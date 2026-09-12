// Ponto único de verdade para exibição do perfil de usuário (Admin/Cliente).

export function ehPerfilAdmin(perfil: string): boolean
{
    return perfil?.toLowerCase() === "admin"
}

export function obterClasseBadgePerfil(perfil: string): string
{
    return ehPerfilAdmin(perfil) ? "badge-perfil-admin" : "badge-perfil-cliente"
}
