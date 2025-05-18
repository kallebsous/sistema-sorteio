"use client"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { useEscalonador } from "../contexto/ContextoEscalonador"
import { useTema } from "../contexto/ContextoTema"

const TelaInicial = () => {
  const navigation = useNavigation()
  const { processos, limparProcessos } = useEscalonador()
  const { cores } = useTema()

  const navegarParaGerenciadorProcessos = () => {
    navigation.navigate("GerenciadorProcessos" as never)
  }

  const navegarParaSimulacao = () => {
    navigation.navigate("Simulacao" as never)
  }

  const navegarParaTutorial = () => {
    navigation.navigate("Tutorial" as never)
  }

  const navegarParaConfiguracoes = () => {
    navigation.navigate("Configuracoes" as never)
  }

  const estilos = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: cores.fundo,
      padding: 16,
    },
    cabecalho: {
      alignItems: "center",
      marginBottom: 24,
    },
    titulo: {
      fontSize: 24,
      fontWeight: "bold",
      color: cores.texto,
      marginTop: 16,
    },
    subtitulo: {
      fontSize: 16,
      color: cores.texto,
      opacity: 0.7,
      textAlign: "center",
      marginTop: 8,
    },
    cartao: {
      backgroundColor: cores.cartao,
      borderRadius: 8,
      padding: 20,
      marginBottom: 16,
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
    },
    tituloCartao: {
      fontSize: 18,
      fontWeight: "bold",
      color: cores.texto,
      marginBottom: 8,
    },
    conteudoCartao: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    contagemProcessos: {
      fontSize: 32,
      fontWeight: "bold",
      color: cores.primaria,
    },
    containerBotoes: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 8,
    },
    botao: {
      flex: 1,
      backgroundColor: cores.primaria,
      borderRadius: 4,
      padding: 12,
      alignItems: "center",
      marginHorizontal: 4,
    },
    textoBotao: {
      color: "white",
      fontWeight: "bold",
    },
    itemMenu: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: cores.cartao,
      borderRadius: 8,
      padding: 16,
      marginBottom: 12,
    },
    iconeMenu: {
      marginRight: 16,
      width: 32,
      alignItems: "center",
    },
    textoMenu: {
      flex: 1,
      color: cores.texto,
      fontSize: 16,
    },
    botaoLimpar: {
      backgroundColor: cores.erro,
      borderRadius: 4,
      padding: 12,
      alignItems: "center",
      marginTop: 16,
    },
    logo: {
      width: 80,
      height: 80,
      marginBottom: 8,
    },
  })

  return (
    <ScrollView style={estilos.container}>
      <View style={estilos.cabecalho}>
        <Image source={{ uri: "https://reactnative.dev/img/tiny_logo.png" }} style={estilos.logo} />
        <Text style={estilos.titulo}>Escalonador de Loteria Preemptivo</Text>
        <Text style={estilos.subtitulo}>
          Uma ferramenta educacional para entender o escalonamento de loteria preemptivo em sistemas operacionais
        </Text>
      </View>

      <View style={estilos.cartao}>
        <Text style={estilos.tituloCartao}>Gerenciador de Processos</Text>
        <View style={estilos.conteudoCartao}>
          <Text style={estilos.contagemProcessos}>{processos.length}</Text>
          <Text style={{ color: cores.texto }}>Processos configurados</Text>
        </View>
        <View style={estilos.containerBotoes}>
          <TouchableOpacity style={estilos.botao} onPress={navegarParaGerenciadorProcessos}>
            <Text style={estilos.textoBotao}>Gerenciar Processos</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={estilos.cartao}>
        <Text style={estilos.tituloCartao}>Ferramenta Educacional</Text>
        <Text style={{ color: cores.texto, marginBottom: 12 }}>
          Este simulador foi desenvolvido para ajudar estudantes a compreenderem o funcionamento do escalonamento de
          loteria preemptivo em sistemas operacionais.
        </Text>
        <View style={estilos.containerBotoes}>
          <TouchableOpacity style={estilos.botao} onPress={navegarParaTutorial}>
            <Text style={estilos.textoBotao}>Material Educacional</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={estilos.itemMenu} onPress={navegarParaSimulacao}>
        <View style={estilos.iconeMenu}>
          <Ionicons name="play-circle-outline" size={24} color={cores.primaria} />
        </View>
        <Text style={estilos.textoMenu}>Executar Simulação</Text>
        <Ionicons name="chevron-forward" size={20} color={cores.texto} />
      </TouchableOpacity>

      <TouchableOpacity style={estilos.itemMenu} onPress={navegarParaTutorial}>
        <View style={estilos.iconeMenu}>
          <Ionicons name="school-outline" size={24} color={cores.primaria} />
        </View>
        <Text style={estilos.textoMenu}>Como Funciona o Escalonamento de Loteria</Text>
        <Ionicons name="chevron-forward" size={20} color={cores.texto} />
      </TouchableOpacity>

      <TouchableOpacity style={estilos.itemMenu} onPress={navegarParaConfiguracoes}>
        <View style={estilos.iconeMenu}>
          <Ionicons name="settings-outline" size={24} color={cores.primaria} />
        </View>
        <Text style={estilos.textoMenu}>Configurações</Text>
        <Ionicons name="chevron-forward" size={20} color={cores.texto} />
      </TouchableOpacity>

      {processos.length > 0 && (
        <TouchableOpacity style={estilos.botaoLimpar} onPress={limparProcessos}>
          <Text style={estilos.textoBotao}>Limpar Todos os Processos</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  )
}

export default TelaInicial
