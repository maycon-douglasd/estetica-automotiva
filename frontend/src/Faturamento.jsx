import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

function Faturamento() {

  const [faturamentoMes, setFaturamentoMes] = useState([])
  const [faturamentoDia, setFaturamentoDia] = useState([])
  const [faturamentoSemana, setFaturamentoSemana] = useState([])
  const [despesasTotal, setDespesasTotal] = useState(0)


  async function buscarFaturamentoMes() {
    try {
      const resposta = await fetch(`${import.meta.env.VITE_API_URL}/faturamento`)
      const dados = await resposta.json()
      setFaturamentoMes(dados)
    } catch (erro) {
      console.error('Erro ao buscar faturamento mensal:', erro)
      console.error('Erro ao buscar faturamento mensal')
    }
  }

  async function buscarFaturamentoDia() {
    try {
      const resposta = await fetch(`${import.meta.env.VITE_API_URL}/faturamento/dia`)
      const dados = await resposta.json()
      setFaturamentoDia(dados)
    } catch (erro) {
      console.error('Erro ao buscar faturamento diário:', erro)
      console.error('Erro ao buscar faturamento diário')
    }
  }

  async function buscarFaturamentoSemana() {
    try {
      const resposta = await fetch(`${import.meta.env.VITE_API_URL}/faturamento/semana`)
      const dados = await resposta.json()
      setFaturamentoSemana(dados)
    } catch (erro) {
      console.error('Erro ao buscar faturamento semanal:', erro)
      console.error('Erro ao buscar faturamento semanal')
    }
  }

  async function buscarDespesasTotal() {
    try {
      const resposta = await fetch(`${import.meta.env.VITE_API_URL}/despesas/total`)
      const dados = await resposta.json()
      setDespesasTotal(Number(dados.despesas_total) || 0)
    } catch (erro) {
      console.error('Erro ao buscar total de despesas:', erro)
      console.error('Erro ao buscar total de despesas')
    }
  }

  const faturamentoBrutoTotal = faturamentoMes.reduce((total, item) => total + Number(item.faturamento_total), 0)
  const faturamentoLiquido = faturamentoBrutoTotal - despesasTotal
  const dadosGraficoDia = faturamentoDia.map((item) => ({
    dia: new Date(item.date).toLocaleDateString('pt-BR'),
    valor: Number(item.faturamento_total)
  }))

  const dadosGraficoSemana = faturamentoSemana.map((item) => ({
    semana: new Date(item.date_trunc).toLocaleDateString('pt-BR'),
    valor: Number(item.faturamento_total)
  }))

  const dadosGraficoMes = faturamentoMes.map((item) => ({
    mes: new Date(item.date_trunc).toLocaleDateString('pt-BR', { month: 'short' }),
    valor: Number(item.faturamento_total)
  }))

  const alturaGrafico = window.innerWidth < 768 ? 200 : 300

  useEffect(() => {
    buscarFaturamentoMes()
    buscarFaturamentoDia()
    buscarFaturamentoSemana()
    buscarDespesasTotal()
  }, [])

  return (
    <div>
      <div className="grid">
        <div className="card">
          <p>Faturamento bruto</p>

          <p>R$ {faturamentoBrutoTotal.toFixed(2)}</p>
        </div>

        <div className="card">
          <p>Despesas</p>

          <p>R$ {despesasTotal.toFixed(2)}</p>
        </div>

        <div className="card">
          <p>Faturamento líquido</p>

          <p>R$ {faturamentoLiquido.toFixed(2)}</p>
        </div>
      </div>

      <h2>Faturamento por dia</h2>

      <ResponsiveContainer width="100%" height={alturaGrafico}>
        <BarChart data={dadosGraficoDia}>
          <XAxis dataKey="dia" stroke="#e4e6eb" />
          <YAxis stroke="#e4e6eb" />
          <Tooltip contentStyle={{ backgroundColor: '#1f2229', border: 'none' }} />
          <Bar dataKey="valor" fill="#e8871e" />
        </BarChart>
      </ResponsiveContainer>

      <h2>Faturamento por semana</h2>

      <ResponsiveContainer width="100%" height={alturaGrafico}>
        <BarChart data={dadosGraficoSemana}>
          <XAxis dataKey="semana" stroke="#e4e6eb" />
          <YAxis stroke="#e4e6eb" />
          <Tooltip contentStyle={{ backgroundColor: '#1f2229', border: 'none' }} />
          <Bar dataKey="valor" fill="#e8871e" />
        </BarChart>
      </ResponsiveContainer>

      <h2>Faturamento por mês</h2>

      <ResponsiveContainer width="100%" height={alturaGrafico}>
        <BarChart data={dadosGraficoMes}>
          <XAxis dataKey="mes" stroke="#e4e6eb" />
          <YAxis stroke="#e4e6eb" />
          <Tooltip contentStyle={{ backgroundColor: '#1f2229', border: 'none' }} />
          <Bar dataKey="valor" fill="#e8871e" />
        </BarChart>
      </ResponsiveContainer>

    </div>
  )
}

export default Faturamento