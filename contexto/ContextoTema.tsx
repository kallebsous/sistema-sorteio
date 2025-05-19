"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useColorScheme } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"

type TipoTema = "claro" | "escuro" | "sistema"

interface CoresTema {
  fundo: string
  cartao: string
  texto: string
  borda: string
  primaria: string
  secundaria: string
  destaque: string
  erro: string
  fundoProcesso: string
  fundoLinhaDoTempo: string
  corOciosa: string
}

interface ContextoTemaType {
  tema: TipoTema
  setTema: (tema: TipoTema) => void
  cores: CoresTema
  ehEscuro: boolean
}

const coresClaro: CoresTema = {
  fundo: "#FFF8E1",
  cartao: "#FFF3E0",
  texto: "#3E2723",
  borda: "#FFD54F",
  primaria: "#FFC107",
  secundaria: "#FF7043",
  destaque: "#D84315",
  erro: "#C62828",
  fundoProcesso: "#FFE0B2",
  fundoLinhaDoTempo: "#FFFDE7",
  corOciosa: "#FFB300",
}

const coresEscuro: CoresTema = {
  fundo: "#FFF8E1",
  cartao: "#FFF3E0",
  texto: "#3E2723",
  borda: "#FFD54F",
  primaria: "#FFC107",
  secundaria: "#FF7043",
  destaque: "#D84315",
  erro: "#C62828",
  fundoProcesso: "#FFE0B2",
  fundoLinhaDoTempo: "#FFFDE7",
  corOciosa: "#FFB300",
}

const ContextoTema = createContext<ContextoTemaType | undefined>(undefined)

export const ProvedorTema: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const esquemaCorSistema = useColorScheme()
  const [tema, setTemaEstado] = useState<TipoTema>("sistema")

  useEffect(() => {
    // Carregar preferência de tema do armazenamento
    const carregarTema = async () => {
      try {
        const temaArmazenado = await AsyncStorage.getItem("tema")
        if (temaArmazenado) {
          setTemaEstado(temaArmazenado as TipoTema)
        }
      } catch (erro) {
        console.error("Falha ao carregar tema do armazenamento", erro)
      }
    }

    carregarTema()
  }, [])

  // Salvar preferência de tema no armazenamento
  const setTema = async (novoTema: TipoTema) => {
    setTemaEstado(novoTema)
    try {
      await AsyncStorage.setItem("tema", novoTema)
    } catch (erro) {
      console.error("Falha ao salvar tema no armazenamento", erro)
    }
  }

  // Determinar se devemos usar o modo escuro
  const ehEscuro = tema === "escuro" || (tema === "sistema" && esquemaCorSistema === "dark")

  // Obter as cores apropriadas com base no tema
  const cores = ehEscuro ? coresEscuro : coresClaro

  return <ContextoTema.Provider value={{ tema, setTema, cores, ehEscuro }}>{children}</ContextoTema.Provider>
}

export const useTema = () => {
  const contexto = useContext(ContextoTema)
  if (!contexto) {
    throw new Error("useTema deve ser usado dentro de um ProvedorTema")
  }
  return contexto
}
