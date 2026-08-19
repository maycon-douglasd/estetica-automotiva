import { useState, useEffect } from 'react'

function Clientes({ setMensagem, setTipoMensagem }) {

    const [clientes, setClientes] = useState([])
    const [nomeCliente, setNomeCliente] = useState('')
    const [telefone, setTelefone] = useState('')
    const [veiculos, setVeiculos] = useState([])

    async function buscarVeiculos() {
        const resposta = await fetch(`${import.meta.env.VITE_API_URL}/veiculos`)
        const dados = await resposta.json()
        setVeiculos(dados)
    }

    async function buscarClientes() {
        const resposta = await fetch(`${import.meta.env.VITE_API_URL}/clientes`)
        const dados = await resposta.json()
        setClientes(dados)
    }

    async function cadastrarCliente(e) {
        e.preventDefault()
        const resposta = await fetch(`${import.meta.env.VITE_API_URL}/clientes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nome: nomeCliente,
                telefone: telefone
            })
        })
        const dados = await resposta.json()
        if (dados.erro) {
            setMensagem(dados.erro)
            setTipoMensagem('erro')
        } else {
            buscarClientes()
            setMensagem('Cliente cadastrado com sucesso!')
            setTipoMensagem('sucesso')
            setNomeCliente('')
            setTelefone('')
        }
    }

    async function removerCliente(id) {
        const resposta = await fetch(`${import.meta.env.VITE_API_URL}/clientes/${id}`, { method: 'DELETE' })
        const dados = await resposta.json()
        if (dados.erro) {
            setMensagem(dados.erro)
            setTipoMensagem('erro')
        } else {
            buscarClientes()
            setMensagem('Cliente removido com sucesso!')
            setTipoMensagem('sucesso')
        }
    }

    useEffect(() => {
        buscarClientes()
        buscarVeiculos()
    }, [])

    return (
        <div className="secao">
            <form onSubmit={cadastrarCliente}>
                <input
                    type="text"
                    value={nomeCliente}
                    onChange={(e) => setNomeCliente(e.target.value)}
                    placeholder="Nome do cliente"
                    required
                />

                <input
                    type="text"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    placeholder="Número do telefone"
                    required
                />

                <button type="submit">Cadastrar</button>
            </form>


            <div className="grid">
                {clientes.map((cliente) => (
                    <div key={cliente.id} className="card">
                        <p>{cliente.nome}</p>
                        
                        <p>{cliente.telefone}</p>

                        {veiculos.filter((veiculo) => veiculo.cliente_id === cliente.id).map((veiculo) => (
                            <p key={veiculo.id}>🚗 {veiculo.modelo} - {veiculo.placa}</p>
                        ))}

                        <button className="btn-remover" onClick={() => removerCliente(cliente.id)}>
                            Remover
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Clientes