import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

import MatchPet from './MatchPetMaps';
import Profile from './Profile';

export default function Main() {
  return (
    <Stack.Navigator
        initialRouteName='Match Pet Main'
    >
      <Stack.Screen
        name="Match Pet Main"
        component={MatchPet}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
