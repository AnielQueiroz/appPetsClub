import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

import HomeInside from './HomeInside';
import MyPets from './MyPets';

export default function Main({ userid, username, email }) {
  // console.log('Id Main => ', userid);
  return (
    <Stack.Navigator
      initialRouteName='Home'
    >
      <Stack.Screen
        name="Home"
        component={HomeInside}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MyPets"
        component={MyPets}
        options={{ title: 'Meus Animais de Estimação' }}
        initialParams={{ userid, username, email }}
      />
    </Stack.Navigator>
  );
}
