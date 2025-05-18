"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Slider } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useEscalonador } from "../contexto/ContextoEscalonador"
import { useTema } from "../contexto/ContextoTema"

const TelaConfiguracoes = () => {
  const {
    quantumTempo,
    setQuantumTempo,
    sobrecargaTrocaContexto,
    setSobrecargaTrocaContexto,
    velocidadeSimulacao,
    setVelocidadeSimulacao,
  } = useEscalonador()

  const { tema, setTema, cores, ehEscuro } = useTema()

  const [quantumTempoLocal, setQuantumTempoLocal] = useState(quantumTempo)
  const [sobrecargaTrocaContextoLocal, setSobrecargaTrocaContextoLocal] = useState(sobrecargaTrocaContexto)
  const [velocidadeSimulacaoLocal, setVelocidadeSimulacaoLocal] = useState(velocidadeSimulacao)

  const handleMudancaTema = (novoTema: "claro" | "escuro" | "sistema") => {
    setTema(novoTema)
  }

  const handleSalvarConfiguracoes = () => {
    setQuantumTempo(quantumTempoLocal)
    setSobrecargaTrocaContexto(sobrecargaTrocaContextoLocal)
    setVelocidadeSimulacao(velocidadeSimulacaoLocal)
  }

  const estilos = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: cores.fundo,
    },
    conteudo: {
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
    linhaConfiguracao: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: cores.borda,
    },
    labelConfiguracao: {
      fontSize: 16,
      color: cores.texto,
    },
    valorConfiguracao: {
      fontSize: 16,
      fontWeight: "bold",
      color: cores.primaria,
      marginLeft: 8,
    },
    containerSlider: {
      marginTop: 8,
      marginBottom: 16,
    },
    labelsSlider: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 4,
    },
    labelSlider: {
      fontSize: 12,
      color: cores.texto,
      opacity: 0.7,
    },
    opcaoTema: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
    },
    textoOpcaoTema: {
      fontSize: 16,
      color: cores.texto,
      marginLeft: 12,
    },
    botaoSalvar: {
      backgroundColor: cores.primaria,
      borderRadius: 8,
      padding: 16,
      alignItems: "center",
      marginTop: 8,
    },
    textoBotaoSalvar: {
      color: "white",
      fontWeight: "bold",
      fontSize: 16,
    },
    containerValor: {
      flexDirection: "row",
      alignItems: "center",
    },
  })

  return (
    <ScrollView style={estilos.container}>
      <View style={estilos.conteudo}>
        <View style={estilos.secao}>
          <Text style={estilos.tituloSecao}>Configurações de Simulação</Text>

          <View>
            <View style={estilos.linhaConfiguracao}>
              <Text style={estilos.labelConfiguracao}>Quantum de Tempo</Text>
              <View style={estilos.containerValor}>
                <Text style={estilos.valorConfiguracao}>{quantumTempoLocal}</Text>
              </View>
            </View>
            <View style={estilos.containerSlider}>
              <Slider
                minimumValue={1}
                maximumValue={10}
                step={1}
                value={quantumTempoLocal}
                onValueChange={setQuantumTempoLocal}
                minimumTrackTintColor={cores.primaria}
                maximumTrackTintColor={cores.borda}
                thumbTintColor={cores.primaria}
              />
              <View style={estilos.labelsSlider}>
                <Text style={estilos.labelSlider}>1</Text>
                <Text style={estilos.labelSlider}>10</Text>
              </View>
            </View>

            <View style={estilos.linhaConfiguracao}>
              <Text style={estilos.labelConfiguracao}>Sobrecarga de Troca de Contexto</Text>
              <View style={estilos.containerValor}>
                <Text style={estilos.valorConfiguracao}>{sobrecargaTrocaContextoLocal}</Text>
              </View>
            </View>
            <View style={estilos.containerSlider}>
              <Slider
                minimumValue={0}
                maximumValue={5}
                step={1}
                value={sobrecargaTrocaContextoLocal}
                onValueChange={setSobrecargaTrocaContextoLocal}
                minimumTrackTintColor={cores.primaria}
                maximumTrackTintColor={cores.borda}
                thumbTintColor={cores.primaria}
              />
              <View style={estilos.labelsSlider}>
                <Text style={estilos.labelSlider}>0</Text>
                <Text style={estilos.labelSlider}>5</Text>
              </View>
            </View>

            <View style={estilos.linhaConfiguracao}>
              <Text style={estilos.labelConfiguracao}>Velocidade de Simulação</Text>
              <View style={estilos.containerValor}>
                <Text style={estilos.valorConfiguracao}>{velocidadeSimulacaoLocal}x</Text>
              </View>
            </View>
            <View style={estilos.containerSlider}>
              <Slider
                minimumValue={0.5}
                maximumValue={5}
                step={0.5}
                value={velocidadeSimulacaoLocal}
                onValueChange={setVelocidadeSimulacaoLocal}
                minimumTrackTintColor={cores.primaria}
                maximumTrackTintColor={cores.borda}
                thumbTintColor={cores.primaria}
              />
              <View style={estilos.labelsSlider}>
                <Text style={estilos.labelSlider}>Lento</Text>
                <Text style={estilos.labelSlider}>Rápido</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={estilos.botaoSalvar} onPress={handleSalvarConfiguracoes}>
            <Text style={estilos.textoBotaoSalvar}>Salvar Configurações</Text>
          </TouchableOpacity>
        </View>

        <View style={estilos.secao}>
          <Text style={estilos.tituloSecao}>Aparência</Text>

          <TouchableOpacity style={estilos.opcaoTema} onPress={() => handleMudancaTema("claro")}>
            <Ionicons
              name={tema === "claro" ? "radio-button-on" : "radio-button-off"}
              size={24}
              color={cores.primaria}
            />
            <Text style={estilos.textoOpcaoTema}>Tema Claro</Text>
          </TouchableOpacity>

          <TouchableOpacity style={estilos.opcaoTema} onPress={() => handleMudancaTema("escuro")}>
            <Ionicons
              name={tema === "escuro" ? "radio-button-on" : "radio-button-off"}
              size={24}
              color={cores.primaria}
            />
            <Text style={estilos.textoOpcaoTema}>Tema Escuro</Text>
          </TouchableOpacity>

          <TouchableOpacity style={estilos.opcaoTema} onPress={() => handleMudancaTema("sistema")}>
            <Ionicons
              name={tema === "sistema" ? "radio-button-on" : "radio-button-off"}
              size={24}
              color={cores.primaria}
            />
            <Text style={estilos.textoOpcaoTema}>Padrão do Sistema</Text>
          </TouchableOpacity>
        </View>

        <View style={estilos.secao}>
          <Text style={estilos.tituloSecao}>Sobre</Text>
          <Text style={{ color: cores.texto }}>Simulador de Escalonador de Loteria Preemptivo v1.0</Text>
          <Text style={{ color: cores.texto, marginTop: 8 }}>
            Uma ferramenta educacional para ajudar estudantes a entender os conceitos de escalonamento de loteria
            preemptivo em sistemas operacionais.
          </Text>
        </View>
      </View>
    </ScrollView>
  )
}

export default TelaConfiguracoes
