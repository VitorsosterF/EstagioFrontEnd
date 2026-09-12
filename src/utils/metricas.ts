import type { Obra } from "../types/obras"
import type { Usuario } from "../types/usuarios"
import { STATUS_OBRA } from "./statusObra"

export interface MetricasObras {
    total: number
    porStatus: Record<string, number>
    percentualConcluidas: number
    obrasRecentes: Obra[]
}

export interface MetricasUsuarios {
    total: number
    admins: number
    clientes: number
}

export function calcularMetricasObras(obras: Obra[]): MetricasObras
{
    const porStatus: Record<string, number> = {}
    for (const status of STATUS_OBRA) porStatus[status] = 0
    for (const obra of obras) porStatus[obra.status] = (porStatus[obra.status] ?? 0) + 1

    const total = obras.length
    const concluidas = porStatus["Concluída"] ?? 0
    const percentualConcluidas = total > 0 ? Math.round((concluidas / total) * 100) : 0

    const obrasRecentes = [...obras]
        .sort((a, b) => new Date(b.criadoEm ?? 0).getTime() - new Date(a.criadoEm ?? 0).getTime())
        .slice(0, 5)

    return { total, porStatus, percentualConcluidas, obrasRecentes }
}

export function calcularMetricasUsuarios(usuarios: Usuario[]): MetricasUsuarios
{
    const admins = usuarios.filter(u => u.perfil?.toLowerCase() === "admin").length
    return { total: usuarios.length, admins, clientes: usuarios.length - admins }
}
