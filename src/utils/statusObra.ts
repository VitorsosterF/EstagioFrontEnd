// Ponto único de verdade para status de obra: nomes, classes de badge e chaves
// usadas em barras/gráficos. Evita que cada tela tenha sua própria lógica de
// mapeamento (e divirja/quebre quando um status "cair" no fallback errado).

export const STATUS_OBRA = ["Não iniciada", "Em andamento", "Pausada", "Concluída"] as const

export type StatusObra = typeof STATUS_OBRA[number]

export function obterChaveStatus(status: string): string
{
    if (status === "Não iniciada") return "nao-iniciada"
    if (status === "Em andamento") return "andamento"
    if (status === "Concluída") return "concluida"
    if (status === "Pausada") return "pausada"
    return "nao-iniciada"
}

export function obterClasseBadgeStatus(status: string): string
{
    return `badge-${obterChaveStatus(status)}`
}
