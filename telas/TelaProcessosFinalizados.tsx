"use client"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { useEscalonador } from "../contexto/ContextoEscalonador"
import { useTema } from "../contexto/ContextoTema"

const TelaProcessosFinalizados = () => {
  const navigation = useNavigation()
  const { resultadoSimulacao } = useEscalonador()
  const { cores } = useTema()

  if (!resultadoSimulacao) {
    navigation.goBack()
    return null
  }

  const { processos } = resultadoSimulacao

  // Filtrar apenas processos finalizados
  const processosFinalizados = processos.filter((p) => p.tempoFinalizacao !== null)

  // Ordenar processos por tempo de finalização
  const processosOrdenados = [...processosFinalizados].sort((a, b) => {
    if (a.tempoFinalizacao === null || b.tempoFinalizacao === null) return 0
    return a.tempoFinalizacao - b.tempoFinalizacao
  })

  const estilos = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: cores.fundo,
      padding: 16,
    },
    secao: {
      backgroundColor: cores.cartao,
      borderRadius: 8,
      padding: 16,
      marginBottom: 16,
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
    },
    tituloSecao: {
      fontSize: 18,
      fontWeight: "bold",
      color: cores.texto,
      marginBottom: 16,
    },
    cabecalhoTabela: {
      flexDirection: "row",
      backgroundColor: cores.primaria + "20",
      padding: 8,
      borderRadius: 4,
      marginBottom: 8,
    },
    celulaCabecalhoTabela: {
      flex: 1,
      fontWeight: "bold",
      color: cores.texto,
      fontSize: 12,
      textAlign: "center",
    },
    linhaTabela: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: cores.borda,
      padding: 8,
    },
    celulaTabela: {
      flex: 1,
      color: cores.texto,
      fontSize: 12,
      textAlign: "center",
    },
    corProcesso: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginRight: 4,
    },
    containerNomeProcesso: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    botao: {
      backgroundColor: cores.primaria,
      borderRadius: 8,
      padding: 16,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    textoBotao: {
      color: "white",
      fontWeight: "bold",
      marginLeft: 8,
    },
    infoTexto: {
      color: cores.texto,
      fontSize: 14,
      marginBottom: 16,
      textAlign: "center",
    },
  })

  return (
    <ScrollView style={estilos.container}>
      <View style={estilos.secao}>
        <Text style={estilos.tituloSecao}>Processos Finalizados</Text>
        <Text style={estilos.infoTexto}>Lista de processos finalizados, ordenados pelo tempo de finalização</Text>

        <View style={estilos.cabecalhoTabela}>
          <Text style={[estilos.celulaCabecalhoTabela, { flex: 0.5 }]}>Processo</Text>
          <Text style={estilos.celulaCabecalhoTabela}>Chegada</Text>
          <Text style={estilos.celulaCabecalhoTabela}>Finalização</Text>
          <Text style={estilos.celulaCabecalhoTabela}>Tempo Total</Text>
          <Text style={estilos.celulaCabecalhoTabela}>Execução</Text>
          <Text style={estilos.celulaCabecalhoTabela}>Espera</Text>
        </View>

        {processosOrdenados.map((processo) => (
          <View key={processo.id} style={estilos.linhaTabela}>
            <View style={[estilos.celulaTabela, { flex: 0.5 }]}>
              <View style={estilos.containerNomeProcesso}>
                <View style={[estilos.corProcesso, { backgroundColor: processo.cor }]} />
                <Text style={{ color: cores.texto }}>{processo.nome}</Text>
              </View>
            </View>
            <Text style={estilos.celulaTabela}>{processo.tempoChegada}</Text>
            <Text style={estilos.celulaTabela}>{processo.tempoFinalizacao}</Text>
            <Text style={estilos.celulaTabela}>{processo.tempoRetorno}</Text>
            <Text style={estilos.celulaTabela}>{processo.tempoExecucao}</Text>
            <Text style={estilos.celulaTabela}>{processo.tempoEspera}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={estilos.botao} onPress={() => navigation.navigate("Simulacao" as never)}>
        <Ionicons name="arrow-back" size={20} color="white" />
        <Text style={estilos.textoBotao}>Voltar para Simulação</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

export default TelaProcessosFinalizados
