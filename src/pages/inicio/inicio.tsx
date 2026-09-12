import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../../services/api"
import type { Obra } from "../../types/obras"
import type { Usuario } from "../../types/usuarios"
import { calcularMetricasObras, calcularMetricasUsuarios } from "../../utils/metricas"
import { obterClasseBadgeStatus } from "../../utils/statusObra"
import { obterClasseBadgePerfil } from "../../utils/perfil"
import { obterNomeUsuario } from "../../services/auth"
import { ArrowRight } from "lucide-react"
import "./inicio.css"

function Inicio()
{
    const [obras, setObras] = useState<Obra[]>([])
    const [usuarios, setUsuarios] = useState<Usuario[]>([])
    const [carregando, setCarregando] = useState(true)
    const navigate = useNavigate()
    const nomeUsuario = obterNomeUsuario()
    const primeiroNome = nomeUsuario.split(" ")[0] || "bem-vindo"

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
    const obrasRecentes = metricasObras.obrasRecentes
    // Sem data de criação no cadastro de usuário: assume-se que o array vem
    // em ordem de inserção, então os últimos 5 são os mais recentes.
    const usuariosRecentes = [...usuarios].slice(-5).reverse()

    return (
        <div className="pagina">
            <div className="pagina-header">
                <h1 className="titulo">Olá, {primeiroNome}!</h1>
            </div>

            {carregando ? (
                <p className="lista-vazia">Carregando...</p>
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
                            <span className="metric-card-label">Usuários cadastrados</span>
                            <span className="metric-card-valor">{metricasUsuarios.total}</span>
                        </div>
                    </div>

                    <div className="inicio-colunas">
                        <div className="inicio-secao">
                            <div className="inicio-secao-header">
                                <h2 className="lista-titulo inicio-secao-titulo">Obras recentes</h2>
                                <button className="inicio-ver-tudo" onClick={() => navigate("/obras")}>
                                    Ver todas <ArrowRight size={14} />
                                </button>
                            </div>
                            {obrasRecentes.length === 0 ? (
                                <p className="lista-vazia">Nenhuma obra cadastrada ainda.</p>
                            ) : (
                                <div className="lista">
                                    {obrasRecentes.map(obra => (
                                        <div key={obra.id} className="inicio-item" onClick={() => navigate(`/obras/${obra.id}`)}>
                                            <span className="inicio-item-titulo">{obra.nome}</span>
                                            <span className={obterClasseBadgeStatus(obra.status)}>{obra.status}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="inicio-secao">
                            <div className="inicio-secao-header">
                                <h2 className="lista-titulo inicio-secao-titulo">Usuários recentes</h2>
                                <button className="inicio-ver-tudo" onClick={() => navigate("/usuarios")}>
                                    Ver todos <ArrowRight size={14} />
                                </button>
                            </div>
                            {usuariosRecentes.length === 0 ? (
                                <p className="lista-vazia">Nenhum usuário cadastrado ainda.</p>
                            ) : (
                                <div className="lista">
                                    {usuariosRecentes.map(usuario => (
                                        <div key={usuario.id} className="inicio-item" onClick={() => navigate("/usuarios")}>
                                            <span className="inicio-item-titulo">{usuario.nome} {usuario.sobrenome}</span>
                                            <span className={`badge-perfil ${obterClasseBadgePerfil(usuario.perfil)}`}>
                                                {usuario.perfil || "Sem perfil"}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default Inicio
