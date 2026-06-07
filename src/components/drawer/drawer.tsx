interface DrawerProps
{
    paginaAtiva: string
    setPaginaAtiva: (pagina: string) => void
    onSair: () => void
}

function Drawer({ paginaAtiva, setPaginaAtiva, onSair }: DrawerProps)
{
    return (
        <div className="drawer">

            <div className="drawer-logo">
                <span className="drawer-logo-texto">ConstruGestor</span>
            </div>

            <nav className="drawer-nav">
                <button
                    className={`drawer-link ${paginaAtiva === "obras" ? "drawer-link-ativo" : ""}`}
                    onClick={() => setPaginaAtiva("obras")}
                >
                    Obras
                </button>

                <button
                    className={`drawer-link ${paginaAtiva === "usuarios" ? "drawer-link-ativo" : ""}`}
                    onClick={() => setPaginaAtiva("usuarios")}
                >
                    Usuários
                </button>
            </nav>

            <div className="drawer-footer">
                <div className="drawer-usuario">
                    <div className="drawer-avatar">AD</div>
                    <div className="drawer-usuario-info">
                        <span className="drawer-usuario-nome">Administrador</span>
                        <span className="drawer-usuario-perfil">Admin</span>
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