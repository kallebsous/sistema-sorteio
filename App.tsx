import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { StatusBar } from "expo-status-bar"

// Telas
import TelaInicial from "./telas/TelaInicial"
import TelaSimulacao from "./telas/TelaSimulacao"
import TelaGerenciadorProcessos from "./telas/TelaGerenciadorProcessos"
import TelaConfiguracoes from "./telas/TelaConfiguracoes"
import TelaTutorial from "./telas/TelaTutorial"
import TelaResultados from "./telas/TelaResultados"
import TelaProcessosFinalizados from "./telas/TelaProcessosFinalizados"

// Contexto
import { ProvedorEscalonador } from "./contexto/ContextoEscalonador"
import { ProvedorTema } from "./contexto/ContextoTema"

const Pilha = createNativeStackNavigator()

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ProvedorTema>
          <ProvedorEscalonador>
            <NavigationContainer>
              <StatusBar style="auto" />
              <Pilha.Navigator
                initialRouteName="Inicial"
                screenOptions={({ route }) => ({
                  headerStyle: {
                    backgroundColor: "#6200ee",
                  },
                  headerTintColor: "#fff",
                  headerTitleStyle: {
                    fontWeight: "bold",
                  },
                  animation: "slide_from_right",
                })}
              >
                <Pilha.Screen name="Inicial" component={TelaInicial} options={{ title: "Escalonador de Loteria" }} />
                <Pilha.Screen
                  name="GerenciadorProcessos"
                  component={TelaGerenciadorProcessos}
                  options={{ title: "Gerenciador de Processos" }}
                />
                <Pilha.Screen name="Simulacao" component={TelaSimulacao} options={{ title: "Simulação" }} />
                <Pilha.Screen
                  name="Resultados"
                  component={TelaResultados}
                  options={{ title: "Resultados da Simulação" }}
                />
                <Pilha.Screen
                  name="ProcessosFinalizados"
                  component={TelaProcessosFinalizados}
                  options={{ title: "Processos Finalizados" }}
                />
                <Pilha.Screen name="Tutorial" component={TelaTutorial} options={{ title: "Como Funciona" }} />
                <Pilha.Screen name="Configuracoes" component={TelaConfiguracoes} options={{ title: "Configurações" }} />
              </Pilha.Navigator>
            </NavigationContainer>
          </ProvedorEscalonador>
        </ProvedorTema>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
