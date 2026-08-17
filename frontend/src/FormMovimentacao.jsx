import { useState } from 'react'

function FormMovimentacao({ produtoId, registrarMovimentacao }) {
    const [tipoMovimentacao, setTipoMovimentacao] = useState('')
    const [quantidadeMovimentacao, setQuantidadeMovimentacao] = useState('')

    async function handleRegistrar() {
        if (!tipoMovimentacao || !quantidadeMovimentacao) {
            return
        }
        const sucesso = await registrarMovimentacao(produtoId, tipoMovimentacao, quantidadeMovimentacao)
        if (sucesso) {
            setTipoMovimentacao('')
            setQuantidadeMovimentacao('')
        }
    }

    return (
        <div>
            <select value={tipoMovimentacao} onChange={(e) => setTipoMovimentacao(e.target.value)}>
                <option value="">Movimentação</option>

                <option value="entrada">Entrada</option>

                <option value="saida">Saída</option>
            </select>

            <input
                type="number"
                value={quantidadeMovimentacao}
                onChange={(e) => setQuantidadeMovimentacao(e.target.value)}
                placeholder="Qtd"
            />

            <button onClick={handleRegistrar}>
                Registrar
            </button>
        </div>
    )
}

export default FormMovimentacao