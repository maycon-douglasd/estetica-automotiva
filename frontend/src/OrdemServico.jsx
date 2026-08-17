import { useState, useEffect } from 'react'

function OrdemServico({ setMensagem, setTipoMensagem }) {

    const [ordens, setOrdens] = useState([])
    const [veiculoId, setVeiculoId] = useState('')
    const [servicoId, setServicoId] = useState('')
    const [valor, setValor] = useState('')
    const [status, setStatus] = useState('')
    const [veiculos, setVeiculos] = useState([])
    const [servicos, setServicos] = useState([])
    const [ordemEditando, setOrdemEditando] = useState(null)

    async function buscarOrdens() {
        const resposta = await fetch('http://localhost:3000/ordem-servico')
        const dados = await resposta.json()
        setOrdens(dados)
    }

    async function buscarVeiculos() {
        const resposta = await fetch('http://localhost:3000/veiculos')
        const dados = await resposta.json()
        setVeiculos(dados)
    }

    async function buscarServicos() {
        const resposta = await fetch('http://localhost:3000/servicos')
        const dados = await resposta.json()
        setServicos(dados)
    }

    useEffect(() => {
        buscarOrdens()
        buscarVeiculos()
        buscarServicos()
    }, [])

    async function cadastrarOrdem(e) {
        e.preventDefault()
        let url = 'http://localhost:3000/ordem-servico'
        let metodo = 'POST'
        if (ordemEditando) {
            url = `http://localhost:3000/ordem-servico/${ordemEditando.id}`
            metodo = 'PUT'
        }
        const resposta = await fetch(url, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                veiculo_id: veiculoId,
                servico_id: servicoId,
                valor: valor,
                status: status
            })
        })
        const dados = await resposta.json()
        if (dados.erro) {
            setMensagem(dados.erro)
            setTipoMensagem('erro')
        } else {
            buscarOrdens()
            setMensagem('Ordem de serviço salva com sucesso!')
            setTipoMensagem('sucesso')
            setVeiculoId('')
            setServicoId('')
            setValor('')
            setStatus('')
            setOrdemEditando(null)
        }
    }

    function iniciarEdicaoOrdem(ordem) {
        setVeiculoId(ordem.veiculo_id)
        setServicoId(ordem.servico_id)
        setValor(ordem.valor)
        setStatus(ordem.status)
        setOrdemEditando(ordem)
    }

    return (
        <div>
            <form onSubmit={cadastrarOrdem}>
                <select value={veiculoId} onChange={(e) => setVeiculoId(e.target.value)} required>
                    <option value="">Selecione o veículo</option>
                    {veiculos.map((veiculo) => (
                        <option key={veiculo.id} value={veiculo.id}>
                            {veiculo.modelo} - {veiculo.placa}
                        </option>
                    ))}
                </select>

                <select value={servicoId} onChange={(e) => setServicoId(e.target.value)} required>
                    <option value="">Selecione o serviço</option>
                    {servicos.map((servico) => (
                        <option key={servico.id} value={servico.id}>
                            {servico.nome}
                        </option>
                    ))}
                </select>

                <select value={status} onChange={(e) => setStatus(e.target.value)} required>
                    <option value="">Selecione o status</option>
                    <option value="em andamento">Em andamento</option>
                    <option value="concluído">Concluído</option>
                </select>

                <input
                    type="number"
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                    placeholder="Valor"
                    required
                />

                <button type="submit">Cadastrar</button>
            </form>

            <div className="grid">
                {ordens.map((ordem) => (

                    <div key={ordem.id} className="card">
                        <p>Status: {ordem.status}</p>

                        <p>{ordem.valor}</p>

                        <p>{new Date(ordem.data_entrada).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}</p>

                        <p>{ordem.data_saida ? new Date(ordem.data_saida).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }) : 'Ainda em andamento'}</p>
                        
                        <div className="acoes">
                            <button onClick={() => iniciarEdicaoOrdem(ordem)}>Editar</button>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    )
}

export default OrdemServico