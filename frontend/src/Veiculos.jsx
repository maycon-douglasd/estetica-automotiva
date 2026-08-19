import { useState, useEffect } from 'react'

function Veiculos({ setMensagem, setTipoMensagem }) {

  const [veiculos, setVeiculos] = useState([])
  const [clienteId, setClienteId] = useState('')
  const [tipoVeiculo, setTipoVeiculo] = useState('')
  const [placa, setPlaca] = useState('')
  const [modelo, setModelo] = useState('')
  const [cor, setCor] = useState('')
  const [veiculoEditando, setVeiculoEditando] = useState(null)
  const [clientes, setClientes] = useState([])

  async function buscarVeiculos() {
    const resposta = await fetch(`${import.meta.env.VITE_API_URL}/veiculos`)
    const dados = await resposta.json()
    setVeiculos(dados)
  }

  async function cadastrarVeiculo(e) {
    e.preventDefault()

    let url = `${import.meta.env.VITE_API_URL}/veiculos`
    let metodo = 'POST'

    if (veiculoEditando) {
      url = `${import.meta.env.VITE_API_URL}/veiculos/${veiculoEditando.id}`
      metodo = 'PUT'
    }

    const resposta = await fetch(url, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cliente_id: clienteId,
        tipo: tipoVeiculo,
        placa: placa,
        modelo: modelo,
        cor: cor
      })
    })

    const dados = await resposta.json()

    if (dados.erro) {
      setMensagem(dados.erro)
      setTipoMensagem('erro')
    } else {
      buscarVeiculos()
      setMensagem('Veículo salvo com sucesso!')
      setTipoMensagem('sucesso')
      setClienteId('')
      setTipoVeiculo('')
      setPlaca('')
      setModelo('')
      setCor('')
      setVeiculoEditando(null)
    }
  }

  async function removerVeiculo(id) {
    const resposta = await fetch(`${import.meta.env.VITE_API_URL}/veiculos/${id}`, { method: 'DELETE' })
    const dados = await resposta.json()
    if (dados.erro) {
      setMensagem(dados.erro)
      setTipoMensagem('erro')
    } else {
      buscarVeiculos()
      setMensagem('Veículo removido com sucesso!')
      setTipoMensagem('sucesso')
    }
  }

  function iniciarEdicao(veiculo) {
    setClienteId(veiculo.cliente_id)

    setTipoVeiculo(veiculo.tipo)

    setPlaca(veiculo.placa)

    setModelo(veiculo.modelo)

    setCor(veiculo.cor)

    setVeiculoEditando(veiculo)
  }

  async function buscarClientes() {
    const resposta = await fetch(`${import.meta.env.VITE_API_URL}/clientes`)
    const dados = await resposta.json()
    setClientes(dados)
  }

  useEffect(() => {
    buscarVeiculos()
    buscarClientes()
  }, [])

  return (
    <div className="secao">
      <form onSubmit={cadastrarVeiculo}>
        <select value={clienteId} onChange={(e) => setClienteId(e.target.value)} required>
          <option value="">Selecione o cliente</option>
          {clientes.map((cliente) => (
            <option key={cliente.id} value={cliente.id}>
              {cliente.nome}
            </option>
          ))}
        </select>

        <input
          type="text"
          value={tipoVeiculo}
          onChange={(e) => setTipoVeiculo(e.target.value)}
          placeholder="Tipo (carro, moto...)"
          required
        />

        <input
          type="text"
          value={placa}
          onChange={(e) => setPlaca(e.target.value)}
          placeholder="Placa"
          required
        />

        <input
          type="text"
          value={modelo}
          onChange={(e) => setModelo(e.target.value)}
          placeholder="Modelo"
          required
        />

        <input
          type="text"
          value={cor}
          onChange={(e) => setCor(e.target.value)}
          placeholder="Cor"
          required
        />

        <button type="submit">Cadastrar</button>
      </form>

      <div className="grid">
        {veiculos.map((veiculo) => (

          <div key={veiculo.id} className="card">

            <p>Proprietário: {clientes.find((cliente) => cliente.id === veiculo.cliente_id)?.nome || 'Cliente não encontrado'}</p>

            <p>{veiculo.tipo}</p>

            <p>{veiculo.placa}</p>

            <p>{veiculo.modelo}</p>

            <p>{veiculo.cor}</p>

            <div className="acoes">
              <button onClick={() => iniciarEdicao(veiculo)}>Editar</button>

              <button className="btn-remover" onClick={() => removerVeiculo(veiculo.id)}>
                Remover
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

export default Veiculos