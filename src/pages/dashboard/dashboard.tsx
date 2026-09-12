import { useEffect, useState } from "react"
import * as XLSX from "xlsx"
import { api } from "../../services/api"
import type { Obra } from "../../types/obras"
import type { Usuario } from "../../types/usuarios"
import { calcularMetricasObras, calcularMetricasUsuarios } from "../../utils/metricas"
import { STATUS_OBRA, obterChaveStatus, obterClasseBadgeStatus } from "../../utils/statusObra"
import { Download } from "lucide-react"
import "./dashboard.css"

function Dashboard()
{
    const [obras, setObras] = useState<Obra[]>([])
    const [usuarios, setUsuarios] = useState<Usuario[]>([])
    const [carregando, setCarregando] = useState(true)

    useEffect(() =>
    {
        Promise.all([api.get("/obras"), api.get("/usuarios")])
            .then(([respostaObras, respostaUsuarios]) =>
            {
                setObras(respostaObras.data)
                setUsuarios(respostaUsuarios.data)
            })
            .finally(() => setCarregando(false))
    }, [])

    const metricasObras = calcularMetricasObras(obras)
    const metricasUsuarios = calcularMetricasUsuarios(usuarios)
    const maiorContagem = Math.max(1, ...STATUS_OBRA.map(status => metricasObras.porStatus[status] ?? 0))

    function exportarXlsx()
    {
        const resumo = [
            { Métrica: "Total de obras", Valor: metricasObras.total },
            ...STATUS_OBRA.map(status => ({ Métrica: `Obras — ${status}`, Valor: metricasObras.porStatus[status] ?? 0 })),
            { Métrica: "Obras concluídas (%)", Valor: `${metricasObras.percentualConcluidas}%` },
            { Métrica: "Total de usuários", Valor: metricasUsuarios.total },
            { Métrica: "Usuários — Admin", Valor: metricasUsuarios.admins },
            { Métrica: "Usuários — Cliente", Valor: metricasUsuarios.clientes },
        ]

        const obrasDetalhadas = obras.map(obra => ({
            Nome: obra.nome,
            Endereço: `${obra.rua}, ${obra.numero}${obra.complemento ? ` - ${obra.complemento}` : ""}`,
            Cliente: obra.cliente ? `${obra.cliente.nome} ${obra.cliente.sobrenome}` : "-",
            Status: obra.status,
            Descrição: obra.descricao ?? "",
            "Criado em": obra.criadoEm ? new Date(obra.criadoEm).toLocaleDateString("pt-BR") : "-"
        }))

        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(resumo), "Resumo")
        XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(obrasDetalhadas), "Obras")

        const dataAtual = new Date().toISOString().slice(0, 10)
        XLSX.writeFile(workbook, `metricas-obras-${dataAtual}.xlsx`)
    }

    return (
        <div className="pagina">
            <div className="pagina-header">
                <h1 className="titulo">Dashboard</h1>
                <button
                    className="botao-primario dashboard-botao-exportar"
                    onClick={exportarXlsx}
                    disabled={carregando || obras.length === 0}
                >
                    <Download size={16} /> Exportar XLSX
                </button>
            </div>

            {carregando ? (
                <p className="lista-vazia">Carregando métricas...</p>
            ) : (
                <>
                    <div className="metric-grid">
                        <div className="metric-card">
                            <span className="metric-card-label">Total de obras</span>
                            <span className="metric-card-valor">{metricasObras.total}</span>
                        </div>
                        <div className="metric-card">
                            <span className="metric-card-label">Em andamento</span>
                            <span className="metric-card-valor">{metricasObras.porStatus["Em andamento"] ?? 0}</span>
                        </div>
                        <div className="metric-card">
                            <span className="metric-card-label">Concluídas</span>
                            <span className="metric-card-valor">{metricasObras.percentualConcluidas}%</span>
                        </div>
                        <div className="metric-card">
                            <span className="metric-card-label">Total de usuários</span>
                            <span className="metric-card-valor">{metricasUsuarios.total}</span>
                        </div>
                    </div>

                    <h2 className="lista-titulo">Distribuição por status</h2>

                    {metricasObras.total === 0 ? (
                        <p className="lista-vazia">Nenhuma obra cadastrada ainda.</p>
                    ) : (
                        <div className="dashboard-barras">
                            {STATUS_OBRA.map(status =>
                            {
                                const contagem = metricasObras.porStatus[status] ?? 0
                                const largura = (contagem / maiorContagem) * 100
                                return (
                                    <div key={status} className="dashboard-barra-linha">
                                        <div className="dashboard-barra-status">
                                            <span className={obterClasseBadgeStatus(status)}>{status}</span>
                                        </div>
                                        <div className="dashboard-barra-trilha">
                                            <div
                                                className={`dashboard-barra-preenchimento dashboard-barra-${obterChaveStatus(status)}`}
                                                style={{ width: `${largura}%` }}
                                            />
                                        </div>
                                        <span className="dashboard-barra-contagem">{contagem}</span>
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    <h2 className="lista-titulo">Usuários por perfil</h2>
                    <div className="metric-grid">
                        <div className="metric-card">
                            <span className="metric-card-label">Admin</span>
                            <span className="metric-card-valor">{metricasUsuarios.admins}</span>
                        </div>
                        <div className="metric-card">
                            <span className="metric-card-label">Cliente</span>
                            <span className="metric-card-valor">{metricasUsuarios.clientes}</span>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default Dashboard
