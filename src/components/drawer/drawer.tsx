import "./drawer.css"
import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Home, LayoutDashboard, Building2, Users, FileText, Bell, LogOut, ChevronLeft, ChevronRight, ShieldCheck, User } from "lucide-react"
import { api } from "../../services/api"
import { obterPerfil } from "../../services/auth"
import { ehPerfilAdmin } from "../../utils/perfil"
import type { Notificacao } from "../../types/notificacoes"

interface DrawerProps
{
    onSair: () => void
    nomeUsuario: string
    colapsado: boolean
    aoAlternar: () => void
}

const itensNav = [
    { rota: "/inicio", label: "Início", Icone: Home, admin: false },
    { rota: "/dashboard", label: "Dashboard", Icone: LayoutDashboard, admin: false },
    { rota: "/obras", label: "Obras", Icone: Building2, admin: false },
    { rota: "/usuarios", label: "Usuários", Icone: Users, admin: true },
    { rota: "/templates", label: "Templates", Icone: FileText, admin: true },
    { rota: "/notificacoes", label: "Notificações", Icone: Bell, admin: false },
]

function Drawer({ onSair, nomeUsuario, colapsado, aoAlternar }: DrawerProps)
{
    const navigate = useNavigate()
    const location = useLocation()
    const perfil = obterPerfil()
    const admin = ehPerfilAdmin(perfil)
    const [naoLidas, setNaoLidas] = useState(0)

    useEffect(() =>
    {
        async function carregarNaoLidas()
        {
            try
            {
                const resposta = await api.get<Notificacao[]>(admin ? "/notificacoes" : "/notificacoes/minhas")
                setNaoLidas(resposta.data.filter(n => !n.lida).length)
            }
            catch
            {
                setNaoLidas(0)
            }
        }
        carregarNaoLidas()
    }, [location.pathname])

    const itensVisiveis = itensNav.filter(item => !item.admin || admin)

    return (
        <div className={`drawer ${colapsado ? "drawer-colapsada" : ""}`}>

            <div className={`drawer-logo ${colapsado ? "drawer-logo-colapsada" : ""}`}>
                {!colapsado && <span className="drawer-logo-texto">ConstruGestor</span>}
                <button
                    className="drawer-toggle"
                    onClick={aoAlternar}
                    title={colapsado ? "Expandir menu" : "Recolher menu"}
                >
                    {colapsado ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>
            </div>

            <nav className="drawer-nav">
                {itensVisiveis.map(({ rota, label, Icone }) => (
                    <button
                        key={rota}
                        className={`drawer-link ${colapsado ? "drawer-link-colapsada" : ""} ${location.pathname === rota ? "drawer-link-ativo" : ""}`}
                        onClick={() => navigate(rota)}
                        title={colapsado ? label : undefined}
                    >
                        <Icone size={17} className="drawer-link-icone" />
                        {!colapsado && <span>{label}</span>}
                        {rota === "/notificacoes" && naoLidas > 0 && !colapsado && (
                            <span className="drawer-badge">{naoLidas}</span>
                        )}
                    </button>
                ))}
            </nav>

            <div className="drawer-footer">
                <div className={`drawer-usuario ${colapsado ? "drawer-usuario-colapsada" : ""}`}>
                    <div className="drawer-avatar">
                        {nomeUsuario.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase()}
                    </div>
                    {!colapsado && (
                        <div className="drawer-usuario-info">
                            <span className="drawer-usuario-nome">{nomeUsuario}</span>
                            <span className={`drawer-usuario-perfil ${admin ? "drawer-usuario-perfil-admin" : "drawer-usuario-perfil-cliente"}`}>
                                {admin ? <ShieldCheck size={11} /> : <User size={11} />}
                                {perfil || "Usuário"}
                            </span>
                        </div>
                    )}
                </div>

                <button
                    className={`drawer-sair ${colapsado ? "drawer-link-colapsada" : ""}`}
                    onClick={onSair}
                    title={colapsado ? "Sair" : undefined}
                >
                    <LogOut size={16} className="drawer-link-icone" />
                    {!colapsado && <span>Sair</span>}
                </button>
            </div>

        </div>
    )
}

export default Drawer
