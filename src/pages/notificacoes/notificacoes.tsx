import { useEffect, useState } from "react"
import { api } from "../../services/api"
import { ehAdmin } from "../../services/auth"
import type { Notificacao } from "../../types/notificacoes"
import type { Obra } from "../../types/obras"
import type { Template } from "../../types/templates"
import Modal from "../../components/modal/modal"
import { Check, Trash2 } from "lucide-react"
import { obterMensagemErro } from "../../utils/erros"
import "./notificacoes.css"

function formatarData(iso: string)
{
    return new Date(iso).toLocaleString("pt-BR")
}

function Notificacoes()
{
    const admin = ehAdmin()
    const [aba, setAba] = useState<"minhas" | "todas">(admin ? "todas" : "minhas")
    const [notificacoes, setNotificacoes] = useState<Notificacao[]>([])
    const [obras, setObras] = useState<Obra[]>([])
    const [templates, setTemplates] = useState<Template[]>([])
    const [modalAberto, setModalAberto] = useState(false)
    const [obraId, setObraId] = useState<number | "">("")
    const [templateId, setTemplateId] = useState<number | "">("")
    const [enviando, setEnviando] = useState(false)

    async function carregarNotificacoes()
    {
        const resposta = await api.get(aba === "todas" ? "/notificacoes" : "/notificacoes/minhas")
        setNotificacoes(resposta.data)
    }

    useEffect(() => { carregarNotificacoes() }, [aba])

    useEffect(() =>
    {
        if (!admin) return
        api.get("/obras").then(res => setObras(res.data))
        api.get("/templates").then(res => setTemplates(res.data))
    }, [admin])

    function abrirModalEnvio()
    {
        setObraId("")
        setTemplateId("")
        setModalAberto(true)
    }

    async function handleEnviar(e: React.FormEvent)
    {
        e.preventDefault()
        if (!obraId || !templateId) return
        setEnviando(true)
        try
        {
            await api.post("/notificacoes", { obraId, templateId })
            setModalAberto(false)
            carregarNotificacoes()
        }
        catch (error)
        {
            alert(obterMensagemErro(error, "Erro ao enviar notificação."))
        }
        finally
        {
            setEnviando(false)
        }
    }

    async function marcarComoLida(id: number)
    {
        try
        {
            await api.patch(`/notificacoes/${id}/lida`)
            carregarNotificacoes()
        }
        catch (error)
        {
            alert(obterMensagemErro(error, "Erro ao marcar notificação como lida."))
        }
    }

    async function handleDelete(id: number)
    {
        if (!confirm("Deseja excluir esta notificação?")) return
        try
        {
            await api.delete(`/notificacoes/${id}`)
            carregarNotificacoes()
        }
        catch (error)
        {
            alert(obterMensagemErro(error, "Erro ao excluir notificação."))
        }
    }

    return (
        <div className="pagina">
            <div className="pagina-header">
                <h1 className="titulo">Notificações</h1>
                {admin && (
                    <button className="botao-primario" onClick={abrirModalEnvio}>+ Enviar notificação</button>
                )}
            </div>

            {admin && (
                <div className="notificacao-tabs">
                    <button
                        className={`notificacao-tab ${aba === "todas" ? "notificacao-tab-ativa" : ""}`}
                        onClick={() => setAba("todas")}
                    >
                        Todas
                    </button>
                    <button
                        className={`notificacao-tab ${aba === "minhas" ? "notificacao-tab-ativa" : ""}`}
                        onClick={() => setAba("minhas")}
                    >
                        Minhas
                    </button>
                </div>
            )}

            <Modal aberto={modalAberto} titulo="Enviar notificação" onFechar={() => setModalAberto(false)}>
                <form onSubmit={handleEnviar} className="form">
                    <select value={obraId} onChange={e => setObraId(Number(e.target.value))} required className="input">
                        <option value="" disabled>Selecionar obra</option>
                        {obras.map(o => (
                            <option key={o.id} value={o.id}>
                                {o.nome}{o.cliente ? ` — ${o.cliente.nome} ${o.cliente.sobrenome}` : ""}
                            </option>
                        ))}
                    </select>
                    <select value={templateId} onChange={e => setTemplateId(Number(e.target.value))} required className="input">
                        <option value="" disabled>Selecionar template</option>
                        {templates.map(t => (
                            <option key={t.id} value={t.id}>
                                {t.titulo} ({t.tipo}){t.padraoNotificacaoStatus ? " · padrão de status" : ""}
                            </option>
                        ))}
                    </select>
                    <div className="botoes">
                        <button type="submit" className="botao-primario" disabled={enviando}>
                            {enviando ? "Enviando..." : "Enviar"}
                        </button>
                        <button type="button" className="botao-secundario" onClick={() => setModalAberto(false)}>Cancelar</button>
                    </div>
                </form>
            </Modal>

            {notificacoes.length === 0 ? (
                <p className="lista-vazia">Nenhuma notificação por aqui.</p>
            ) : (
                <div className="lista">
                    {notificacoes.map(n => (
                        <div key={n.id} className={`notificacao-card ${!n.lida ? "notificacao-card-nao-lida" : ""}`}>
                            <div className="notificacao-info">
                                <span className="notificacao-mensagem">{n.mensagem}</span>
                                <span className="notificacao-meta">
                                    <span>{n.obra?.nome}</span>
                                    {aba === "todas" && n.obra?.cliente && (
                                        <span>· {n.obra.cliente.nome} {n.obra.cliente.sobrenome}</span>
                                    )}
                                    <span>· {formatarData(n.dataCriacao)}</span>
                                </span>
                            </div>
                            <div className="notificacao-acoes">
                                <span className={n.lida ? "badge-lida" : "badge-nao-lida"}>{n.lida ? "Lida" : "Não lida"}</span>
                                {!n.lida && (
                                    <button onClick={() => marcarComoLida(n.id)} className="botao-editar" title="Marcar como lida">
                                        <Check size={15} />
                                    </button>
                                )}
                                <button onClick={() => handleDelete(n.id)} className="botao-excluir" title="Excluir">
                                    <Trash2 size={15} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Notificacoes
