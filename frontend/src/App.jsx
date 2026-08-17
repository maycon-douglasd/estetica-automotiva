import { useState, useEffect } from 'react'
import './App.css'
import Produtos from './Produtos'
import Clientes from './Clientes'
import Veiculos from './Veiculos'
import Servicos from './Servicos'
import OrdemServico from './OrdemServico'
import UsoServicos from './UsoServicos'
import Despesas from './Despesas'
import Faturamento from './Faturamento'

function App() {
  const [mensagem, setMensagem] = useState('')
  const [tipoMensagem, setTipoMensagem] = useState('')
  const [secaoAtiva, setSecaoAtiva] = useState('produtos')

  useEffect(() => {
    if (mensagem) {
      setTimeout(() => {
        setMensagem('')
      }, 4000)
    }
  }, [mensagem])

  return (
    <div>
      <h1>JN - Estética Automotiva</h1>

      {mensagem && <p className={`mensagem mensagem-${tipoMensagem}`}>⚠️ {mensagem}</p>}

      <div className="layout">

        <nav>
          <button
            className={secaoAtiva === 'produtos' ? 'ativo' : ''}
            onClick={() => setSecaoAtiva('produtos')}
          >
            Produtos
          </button>

          <button
            className={secaoAtiva === 'clientes' ? 'ativo' : ''}
            onClick={() => setSecaoAtiva('clientes')}
          >
            Clientes
          </button>

          <button
            className={secaoAtiva === 'veiculos' ? 'ativo' : ''}
            onClick={() => setSecaoAtiva('veiculos')}
          >
            Veículos
          </button>

          <button
            className={secaoAtiva === 'servicos' ? 'ativo' : ''}
            onClick={() => setSecaoAtiva('servicos')}
          >
            Serviços
          </button>

          <button
            className={secaoAtiva === 'ordens' ? 'ativo' : ''}
            onClick={() => setSecaoAtiva('ordens')}
          >
            Ordens de Serviço
          </button>

          <button
            className={secaoAtiva === 'uso-servicos' ? 'ativo' : ''}
            onClick={() => setSecaoAtiva('uso-servicos')}
          >
            Uso de Serviços
          </button>

          <button
            className={secaoAtiva === 'despesas' ? 'ativo' : ''}
            onClick={() => setSecaoAtiva('despesas')}
          >
            Despesas
          </button>

          <button
            className={secaoAtiva === 'faturamento' ? 'ativo' : ''}
            onClick={() => setSecaoAtiva('faturamento')}
          >
            Faturamento
          </button>

        </nav>

        <div>
          {secaoAtiva === 'produtos' && <Produtos setMensagem={setMensagem} setTipoMensagem={setTipoMensagem} />}

          {secaoAtiva === 'clientes' && <Clientes setMensagem={setMensagem} setTipoMensagem={setTipoMensagem} />}

          {secaoAtiva === 'veiculos' && <Veiculos setMensagem={setMensagem} setTipoMensagem={setTipoMensagem} />}

          {secaoAtiva === 'servicos' && <Servicos setMensagem={setMensagem} setTipoMensagem={setTipoMensagem} />}

          {secaoAtiva === 'ordens' && <OrdemServico setMensagem={setMensagem} setTipoMensagem={setTipoMensagem} />}

          {secaoAtiva === 'uso-servicos' && <UsoServicos />}

          {secaoAtiva === 'despesas' && <Despesas setMensagem={setMensagem} setTipoMensagem={setTipoMensagem} />}

          {secaoAtiva === 'faturamento' && <Faturamento />}
        </div>
      </div>
    </div>
  )
}

export default App