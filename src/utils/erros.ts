import { isAxiosError } from "axios"

// Extrai uma mensagem de erro segura para exibir ao usuário, sem depender de
// `any`: se for um erro do axios com corpo de resposta (string, geralmente
// enviada pelo backend via ResponseEntity.badRequest().body("...")), usa ele;
// caso contrário cai no texto padrão.
export function obterMensagemErro(error: unknown, mensagemPadrao: string): string
{
    if (isAxiosError(error) && typeof error.response?.data === "string" && error.response.data)
    {
        return error.response.data
    }
    return mensagemPadrao
}
