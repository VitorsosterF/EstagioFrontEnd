import "./drawer.css";
import { useNavigate, useLocation } from "react-router-dom";

interface DrawerProps
{
    paginaAtiva: string
    setPaginaAtiva: (pagina: string) => void
    onSair: () => void
    nomeUsuario: string
}

function Drawer({ paginaAtiva, setPaginaAtiva, onSair, nomeUsuario}: DrawerProps)
{
    const navigate = useNavigate()
    const location = useLocation()

    return (
        <div className="drawer">

            <div className="drawer-logo">
                <span className="drawer-logo-texto">ConstruGestor</span>
            </div>

            <nav className="drawer-nav">
                <button
                    className={`drawer-link ${location.pathname === "/obras" ? "drawer-link-ativo" : ""}`}
                    onClick={() => navigate("/obras")}
                >
                    Obras
                </button>

                <button
                    className={`drawer-link ${location.pathname === "/usuarios" ? "drawer-link-ativo" : ""}`}
                    onClick={() => navigate("/usuarios")}
                >
                    Usuários
                </button>
            </nav>

            <div className="drawer-footer">
                <div className="drawer-usuario">
                    <div className="drawer-avatar">
                         {nomeUsuario.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase()}
                    </div>
                    <div className="drawer-usuario-info">
                        <span className="drawer-usuario-nome">{nomeUsuario}</span>
                    </div>
                </div>

                <button className="drawer-sair" onClick={onSair}>
                    Sair
                </button>
            </div>

        </div>
    )
}

export default Drawer