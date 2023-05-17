import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

import MatchPetFlat from './MatchPetFlat';
import PetDetailsScreen from './PetDetailsScreen';

export default function Main() {
  return (
    <Stack.Navigator
        initialRouteName='Match Pet Main'
    >
      <Stack.Screen
        name="Match Pet Main"
        component={MatchPetFlat}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Pet Details"
        component={PetDetailsScreen}
        options={({ route }) => ({ headerTitle: route.params.pet.namePet})}
      />
    </Stack.Navigator>
  );
}
