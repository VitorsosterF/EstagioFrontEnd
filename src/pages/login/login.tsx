import "./login.css"

interface LoginProps
{
    onLogin: () => void
}

function Login({ onLogin }: LoginProps)
{
    return (
        <div className="login-pagina">

            <div className="login-card">

                <div className="login-logo">
                    <div className="login-logo-icone">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2"/>
                            <path d="M3 9h18M9 21V9"/>
                        </svg>
                    </div>
                    <span className="login-logo-texto">ConstruGestor</span>
                </div>

                <div className="login-header">
                    <h1 className="login-titulo">Bem-vindo de volta</h1>
                    <p className="login-subtitulo">Entre com suas credenciais para acessar</p>
                </div>

                <div className="login-form">
                    <div className="login-campo">
                        <label className="login-label">E-mail</label>
                        <input
                            type="email"
                            placeholder="seu@email.com"
                            className="input"
                        />
                    </div>

                    <div className="login-campo">
                        <label className="login-label">Senha</label>
                        <input
                            type="password"
                            placeholder="senha"
                            className="input"
                        />
                    </div>

                    <a className="login-esqueci">Esqueci minha senha</a>

                    <button className="botao-primario login-botao" onClick={onLogin}>
                        Entrar
                    </button>
                </div>

            </div>

            <p className="login-footer">ConstruGestor © 2026 · v1.0.0</p>

        </div>
    )
}

export default Login