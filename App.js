import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import withPortraitOrientation from './components/lockscreen/lockscreen';

import { globalStyles } from './styles/GlobalStyles';

const Stack = createStackNavigator();

import TeladeLogin from './components/screens/TeladeLogin';
import TeladeCadastro from './components/screens/TeladeCadastro';
import Home from './components/screens/Home';

import { setupDatabase } from './src/database/database-setup';

export default function App() {
  useEffect(() => {
    setupDatabase();
  }, []);

  return (
    <SafeAreaView style={globalStyles.containerApp}>
      <StatusBar style="light" />
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Tela de Login'>
          <Stack.Screen 
            name='Tela de Login' 
            component={TeladeLogin} 
            options={{headerShown: false}} 
          />
          <Stack.Screen 
            name='Tela de Cadastro' 
            component={TeladeCadastro} 
            options={{headerShown: false}} 
          />
          <Stack.Screen 
            name='Home' 
            component={Home} 
            options={{headerShown: false}} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}