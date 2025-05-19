"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

export type TipoProcesso = "cpu" | "io"

export type Processo = {
  id: string
  nome: string
  tipo: TipoProcesso
  tempoChegada: number
  tempoExecucaoTotal: number
  tempoRestanteCPU: number
  tempoRestanteIO: number
  bilhetes: number
  cor: string
  estado: "pronto" | "executando" | "esperando" | "finalizado"
  tempoEspera: number
  tempoRetorno: number
  tempoResposta: number | null
  tempoFinalizacao: number | null
  ioBursts: number[]
  cpuBursts: number[]
  burstAtual: number
}

export type FatiaTempoExecucao = {
  tempo: number
  processoId: string | null
  tipo: "cpu" | "io" | "ocioso"
}

export type ResultadoSimulacao = {
  linhaDoTempo: FatiaTempoExecucao[]
  processos: Processo[]
  tempoEsperaMedia: number
  tempoRetornoMedio: number
  tempoRespostaMedio: number
  utilizacaoCPU: number
  utilizacaoIO: number
  vazao: number
}

type ContextoEscalonadorType = {
  processos: Processo[]
  adicionarProcesso: (processo: Omit<Processo, 
    "id" | "estado" | "tempoEspera" | "tempoRetorno" | "tempoResposta" | 
    "tempoFinalizacao" | "tempoRestanteCPU" | "tempoRestanteIO" | 
    "ioBursts" | "cpuBursts" | "burstAtual" | "cor"
  >) => void
  atualizarProcesso: (processo: Processo) => void
  excluirProcesso: (id: string) => void
  limparProcessos: () => void
  quantumTempo: number
  setQuantumTempo: (valor: number) => void
  sobrecargaTrocaContexto: number
  setSobrecargaTrocaContexto: (valor: number) => void
  velocidadeSimulacao: number
  setVelocidadeSimulacao: (valor: number) => void
  resultadoSimulacao: ResultadoSimulacao | null
  setResultadoSimulacao: (resultado: ResultadoSimulacao | null) => void
  executarSimulacao: () => ResultadoSimulacao
  gerarProcessosAleatorios: (quantidade: number) => void
  simulacaoEmExecucao: boolean
  setSimulacaoEmExecucao: (valor: boolean) => void
  tempoIO: number
  setTempoIO: (valor: number) => void
}

const ContextoEscalonador = createContext<ContextoEscalonadorType | undefined>(undefined)

const CORES_PROCESSOS = [
  "#F44336", "#2196F3", "#4CAF50", "#FF9800", "#9C27B0",
  "#00BCD4", "#FFEB3B", "#795548", "#607D8B", "#E91E63",
  "#3F51B5", "#009688", "#FFC107", "#8BC34A", "#673AB7"
]

const gerarIdUnico = () => Date.now().toString(36) + Math.random().toString(36).substr(2, 9)

export const ProvedorEscalonador: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [processos, setProcessos] = useState<Processo[]>([])
  const [quantumTempo, setQuantumTempo] = useState(2)
  const [sobrecargaTrocaContexto, setSobrecargaTrocaContexto] = useState(0)
  const [velocidadeSimulacao, setVelocidadeSimulacao] = useState(1)
  const [resultadoSimulacao, setResultadoSimulacao] = useState<ResultadoSimulacao | null>(null)
  const [simulacaoEmExecucao, setSimulacaoEmExecucao] = useState(false)
  const [tempoIO, setTempoIO] = useState(2)

  useEffect(() => {
    const carregarConfiguracoes = async () => {
      try {
        const dados = await AsyncStorage.multiGet([
          "processos", "quantumTempo", "sobrecargaTrocaContexto", 
          "velocidadeSimulacao", "tempoIO"
        ])
        
        setProcessos(dados[0][1] ? JSON.parse(dados[0][1]) : [])
        setQuantumTempo(dados[1][1] ? Number(dados[1][1]) : 2)
        setSobrecargaTrocaContexto(dados[2][1] ? Number(dados[2][1]) : 0)
        setVelocidadeSimulacao(dados[3][1] ? Number(dados[3][1]) : 1)
        setTempoIO(dados[4][1] ? Number(dados[4][1]) : 2)
      } catch (erro) {
        console.error("Erro ao carregar configurações:", erro)
      }
    }
    carregarConfiguracoes()
  }, [])

  useEffect(() => {
    AsyncStorage.multiSet([
      ["processos", JSON.stringify(processos)],
      ["quantumTempo", quantumTempo.toString()],
      ["sobrecargaTrocaContexto", sobrecargaTrocaContexto.toString()],
      ["velocidadeSimulacao", velocidadeSimulacao.toString()],
      ["tempoIO", tempoIO.toString()]
    ])
  }, [processos, quantumTempo, sobrecargaTrocaContexto, velocidadeSimulacao, tempoIO])

  const adicionarProcesso = (processo: Omit<Processo, 
    "id" | "estado" | "tempoEspera" | "tempoRetorno" | "tempoResposta" | 
    "tempoFinalizacao" | "tempoRestanteCPU" | "tempoRestanteIO" | 
    "ioBursts" | "cpuBursts" | "burstAtual" | "cor"
  >) => {
    const novoProcesso: Processo = {
      ...processo,
      id: gerarIdUnico(),
      estado: "pronto",
      tempoEspera: 0,
      tempoRetorno: 0,
      tempoResposta: null,
      tempoFinalizacao: null,
      tempoRestanteCPU: 0,
      tempoRestanteIO: 0,
      ioBursts: [],
      cpuBursts: [],
      burstAtual: 0,
      cor: CORES_PROCESSOS[processos.length % CORES_PROCESSOS.length]
    }

    if (processo.tipo === "io") {
      let tempoRestante = processo.tempoExecucaoTotal
      while (tempoRestante > 0) {
        const cpuBurst = Math.min(Math.ceil(Math.random() * 4), tempoRestante)
        novoProcesso.cpuBursts.push(cpuBurst)
        novoProcesso.ioBursts.push(tempoIO)
        tempoRestante -= cpuBurst
      }
      novoProcesso.tempoRestanteCPU = novoProcesso.cpuBursts[0]
    } else {
      novoProcesso.cpuBursts = [processo.tempoExecucaoTotal]
      novoProcesso.tempoRestanteCPU = processo.tempoExecucaoTotal
    }

    setProcessos(prev => [...prev, novoProcesso])
  }

  const atualizarProcesso = (processoAtualizado: Processo) => {
    setProcessos(prev => prev.map(p => 
      p.id === processoAtualizado.id ? processoAtualizado : p
    ))
  }

  const excluirProcesso = (id: string) => {
    setProcessos(prev => prev.filter(p => p.id !== id))
  }

  const limparProcessos = () => {
    setProcessos([])
    setResultadoSimulacao(null)
  }

  const gerarProcessosAleatorios = (quantidade: number) => {
    const qtd = Math.max(1, Math.floor(Number(quantidade)) || 1); // Garante pelo menos 1 processo
    const novosProcessos = Array.from({ length: qtd }, (_, i) => {
      const tipo: TipoProcesso = Math.random() > 0.5 ? "cpu" : "io"
      return {
        id: gerarIdUnico(),
        nome: `${tipo.toUpperCase()}-P${i + 1}`,
        tipo,
        tempoChegada: Math.floor(Math.random() * 10),
        tempoExecucaoTotal: Math.floor(Math.random() * 15) + 5,
        bilhetes: Math.floor(Math.random() * 10) + 1,
        cor: CORES_PROCESSOS[i % CORES_PROCESSOS.length],
        estado: "pronto",
        tempoEspera: 0,
        tempoRetorno: 0,
        tempoResposta: null,
        tempoFinalizacao: null,
        tempoRestanteCPU: 0,
        tempoRestanteIO: 0,
        ioBursts: [],
        cpuBursts: [],
        burstAtual: 0
      } as Processo
    }).map(p => {
      if (p.tipo === "io") {
        let tempoRestante = p.tempoExecucaoTotal
        while (tempoRestante > 0) {
          const cpuBurst = Math.min(Math.ceil(Math.random() * 4), tempoRestante)
          p.cpuBursts.push(cpuBurst)
          p.ioBursts.push(tempoIO)
          tempoRestante -= cpuBurst
        }
        p.tempoRestanteCPU = p.cpuBursts[0]
      } else {
        p.cpuBursts = [p.tempoExecucaoTotal]
        p.tempoRestanteCPU = p.tempoExecucaoTotal
      }
      return p
    })

    setProcessos(novosProcessos)
  }

  const executarSimulacao = (): ResultadoSimulacao => {
    setSimulacaoEmExecucao(true)
    const processosClone: Processo[] = JSON.parse(JSON.stringify(processos))
    const linhaDoTempo: FatiaTempoExecucao[] = []
    let tempoAtual = 0
    let processoAtual: Processo | null = null
    let tempoExecutando = 0
    let processosFinalizados = 0

    while (processosFinalizados < processosClone.length) {
      processosClone.forEach(p => {
        if (p.estado === "esperando") {
          p.tempoRestanteIO--
          if (p.tempoRestanteIO <= 0) {
            p.estado = "pronto"
            p.burstAtual++
            if (p.burstAtual < p.cpuBursts.length) {
              p.tempoRestanteCPU = p.cpuBursts[p.burstAtual]
            }
          }
        }
      })

      const processosProntos = processosClone.filter(p => 
        p.estado === "pronto" && p.tempoChegada <= tempoAtual && p.tempoRestanteCPU > 0
      )

      if (!processoAtual || tempoExecutando >= quantumTempo) {
        if (processosProntos.length > 0) {
          const totalBilhetes = processosProntos.reduce((sum, p) => sum + p.bilhetes, 0)
          const bilheteVencedor = Math.floor(Math.random() * totalBilhetes) + 1
          
          let acumulador = 0
          for (const p of processosProntos) {
            acumulador += p.bilhetes
            if (acumulador >= bilheteVencedor) {
              processoAtual = p
              break
            }
          }

          if (sobrecargaTrocaContexto > 0 && linhaDoTempo.length > 0) {
            for (let i = 0; i < sobrecargaTrocaContexto; i++) {
              linhaDoTempo.push({ tempo: tempoAtual + i, processoId: null, tipo: "ocioso" })
            }
            tempoAtual += sobrecargaTrocaContexto
          }

          tempoExecutando = 0
          if (processoAtual && processoAtual.tempoResposta === null) {
            processoAtual.tempoResposta = tempoAtual - processoAtual.tempoChegada
          }
        }
      }

      if (processoAtual) {
        linhaDoTempo.push({
          tempo: tempoAtual,
          processoId: processoAtual.id,
          tipo: processoAtual.tipo === "cpu" ? "cpu" : "io"
        })

        processoAtual.tempoRestanteCPU--
        tempoExecutando++

        if (processoAtual.tempoRestanteCPU <= 0) {
          if (processoAtual.tipo === "io" && processoAtual.burstAtual < processoAtual.ioBursts.length) {
            processoAtual.tempoRestanteIO = processoAtual.ioBursts[processoAtual.burstAtual]
            processoAtual.estado = "esperando"
          } else {
            processoAtual.estado = "finalizado"
            processoAtual.tempoFinalizacao = tempoAtual + 1
            processoAtual.tempoRetorno = processoAtual.tempoFinalizacao - processoAtual.tempoChegada
            processosFinalizados++
          }
          processoAtual = null
        }
      } else {
        linhaDoTempo.push({ tempo: tempoAtual, processoId: null, tipo: "ocioso" })
      }

      processosProntos.forEach(p => {
        if (p !== processoAtual) p.tempoEspera++
      })

      tempoAtual++
    }

    let tempoEsperaTotal = 0
    let tempoRetornoTotal = 0
    let tempoRespostaTotal = 0
    let tempoCPUUtilizado = 0
    let tempoIOUtilizado = 0

    processosClone.forEach(p => {
      tempoEsperaTotal += p.tempoEspera
      tempoRetornoTotal += p.tempoRetorno
      tempoRespostaTotal += p.tempoResposta || 0
      
      if (p.tipo === "cpu") {
        tempoCPUUtilizado += p.tempoExecucaoTotal
      } else {
        tempoCPUUtilizado += p.cpuBursts.reduce((a, b) => a + b, 0)
        tempoIOUtilizado += p.ioBursts.reduce((a, b) => a + b, 0)
      }
    })

    const tempoTotal = linhaDoTempo.length
    const tempoOcioso = linhaDoTempo.filter(f => f.tipo === "ocioso").length

    const resultado: ResultadoSimulacao = {
      linhaDoTempo,
      processos: processosClone,
      tempoEsperaMedia: tempoEsperaTotal / processosClone.length,
      tempoRetornoMedio: tempoRetornoTotal / processosClone.length,
      tempoRespostaMedio: tempoRespostaTotal / processosClone.length,
      utilizacaoCPU: ((tempoCPUUtilizado - tempoOcioso) / tempoTotal) * 100,
      utilizacaoIO: (tempoIOUtilizado / tempoTotal) * 100,
      vazao: processosClone.length / tempoTotal
    }

    setResultadoSimulacao(resultado)
    setSimulacaoEmExecucao(false)
    return resultado
  }

  return (
    <ContextoEscalonador.Provider value={{
      processos,
      adicionarProcesso,
      atualizarProcesso,
      excluirProcesso,
      limparProcessos,
      quantumTempo,
      setQuantumTempo,
      sobrecargaTrocaContexto,
      setSobrecargaTrocaContexto,
      velocidadeSimulacao,
      setVelocidadeSimulacao,
      resultadoSimulacao,
      setResultadoSimulacao,
      executarSimulacao,
      gerarProcessosAleatorios,
      simulacaoEmExecucao,
      setSimulacaoEmExecucao,
      tempoIO,
      setTempoIO
    }}>
      {children}
    </ContextoEscalonador.Provider>
  )
}

export const useEscalonador = () => {
  const context = useContext(ContextoEscalonador)
  if (!context) throw new Error("useEscalonador deve ser usado dentro de ProvedorEscalonador")
  return context
}