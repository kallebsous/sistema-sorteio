import React, { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native"
import { useTema } from "../contexto/ContextoTema"

// Modelo de processo
interface Processo {
  id: string
  nome: string
  tempoChegada: number
  tempoExecucaoTotal: number
  tempoRestante: number
  bilhetes: number
  tempoInicio?: number
  tempoFim?: number
}

interface Execucao {
  tempo: number
  processoId?: string
}

function gerarProcessosAleatorios(qtd: number): Processo[] {
  return Array.from({ length: qtd }, (_, i) => {
    const tempoChegada = Math.floor(Math.random() * 6) // 0 a 5
    const tempoExecucaoTotal = Math.floor(Math.random() * 8) + 3 // 3 a 10
    const bilhetes = Math.floor(Math.random() * 10) + 1 // 1 a 10
    return {
      id: `P${i + 1}`,
      nome: `P${i + 1}`,
      tempoChegada,
      tempoExecucaoTotal,
      tempoRestante: tempoExecucaoTotal,
      bilhetes,
    }
  })
}

function sortearProcesso(prontos: Processo[]): Processo | null {
  const totalBilhetes = prontos.reduce((acc, p) => acc + p.bilhetes, 0)
  if (totalBilhetes === 0) return null
  let sorteio = Math.floor(Math.random() * totalBilhetes) + 1
  for (const p of prontos) {
    if (sorteio <= p.bilhetes) return p
    sorteio -= p.bilhetes
  }
  return null
}

const QUANTUM = 1

const SimuladorLottery = () => {
  const { cores } = useTema()
  const [processos, setProcessos] = useState<Processo[]>([])
  const [execucao, setExecucao] = useState<Execucao[]>([])
  const [finalizados, setFinalizados] = useState<Processo[]>([])
  const [rodando, setRodando] = useState(false)
  const [usoCPU, setUsoCPU] = useState(0)

  const iniciarSimulacao = () => {
    const procs = gerarProcessosAleatorios(10)
    simular(procs)
  }

  const simular = (procs: Processo[]) => {
    let tempo = 0
    let processos = procs.map(p => ({ ...p }))
    let execucao: Execucao[] = []
    let finalizados: Processo[] = []
    let cpuOcupada = 0
    while (finalizados.length < procs.length) {
      // Atualiza fila de prontos
      const prontos = processos.filter(p => p.tempoChegada <= tempo && p.tempoRestante > 0)
      let processoExecutando: Processo | null = null
      if (prontos.length > 0) {
        processoExecutando = sortearProcesso(prontos)
        if (processoExecutando) {
          if (processoExecutando.tempoInicio === undefined) processoExecutando.tempoInicio = tempo
          processoExecutando.tempoRestante -= QUANTUM
          cpuOcupada++
          execucao.push({ tempo, processoId: processoExecutando.id })
          if (processoExecutando.tempoRestante <= 0) {
            processoExecutando.tempoFim = tempo + 1
            finalizados.push({ ...processoExecutando })
          }
        }
      } else {
        execucao.push({ tempo }) // CPU ociosa
      }
      tempo++
      // Remove processos finalizados da lista de processos ativos
      processos = processos.map(p =>
        p.tempoRestante <= 0 ? { ...p, tempoRestante: 0 } : p
      )
    }
    setProcessos(procs)
    setExecucao(execucao)
    setFinalizados(finalizados.sort((a, b) => (a.tempoFim ?? 0) - (b.tempoFim ?? 0)))
    setUsoCPU(Math.round((cpuOcupada / execucao.length) * 100))
    setRodando(false)
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: cores.fundo, padding: 16 }}>
      <Text style={[styles.titulo, { color: cores.primaria }]}>Simulador Lottery Scheduling</Text>
      <TouchableOpacity style={[styles.botao, { backgroundColor: cores.primaria }]} onPress={iniciarSimulacao}>
        <Text style={{ color: "white", fontWeight: "bold" }}>Iniciar Simulação</Text>
      </TouchableOpacity>
      <Text style={[styles.subtitulo, { color: cores.texto }]}>Processos Gerados</Text>
      <View style={styles.listaProcessos}>
        {processos.map(p => (
          <Text key={p.id} style={{ color: cores.texto }}>
            {p.nome} | Chegada: {p.tempoChegada} | Execução: {p.tempoExecucaoTotal} | Bilhetes: {p.bilhetes}
          </Text>
        ))}
      </View>
      {execucao.length > 0 && (
        <>
          <Text style={[styles.subtitulo, { color: cores.texto }]}>Linha do Tempo</Text>
          <ScrollView horizontal style={{ marginBottom: 16 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {execucao.map((e, i) => (
                <View
                  key={i}
                  style={{
                    width: 32,
                    height: 32,
                    backgroundColor: e.processoId ? cores.primaria : cores.corOciosa,
                    marginRight: 2,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 4,
                  }}
                >
                  <Text style={{ color: cores.texto, fontSize: 12 }}>
                    {e.processoId ? e.processoId : "-"}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>
          <Text style={[styles.subtitulo, { color: cores.texto }]}>Uso da CPU: {usoCPU}%</Text>
          <View style={styles.barraCPU}>
            <View style={{ width: `${usoCPU}%`, backgroundColor: cores.primaria, height: 16, borderRadius: 8 }} />
          </View>
          <Text style={[styles.subtitulo, { color: cores.texto }]}>Processos Finalizados</Text>
          <View style={styles.listaProcessos}>
            {finalizados.map(p => (
              <Text key={p.id} style={{ color: cores.texto }}>
                {p.nome} | Chegada: {p.tempoChegada} | Término: {p.tempoFim} | Execução: {p.tempoExecucaoTotal}
              </Text>
            ))}
          </View>
        </>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitulo: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  botao: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  listaProcessos: {
    marginBottom: 8,
    gap: 2,
  },
  barraCPU: {
    width: "100%",
    height: 16,
    backgroundColor: "#eee",
    borderRadius: 8,
    marginBottom: 16,
    marginTop: 4,
    overflow: "hidden",
  },
})

export default SimuladorLottery 