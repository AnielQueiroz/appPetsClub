import React from 'react';
import { View, Text } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { drawerNavigatorBg, drawerScreenOptions } from './styles/stylesScreens';
import { decode, encode } from 'base-64';

if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}

import PetShopMapsComponent from './mocks/PetsShopMaps/PetShopMapsComponent';
import Main from './mocks/Main';
import MatchPetMainScreen from './mocks/MatchPet/Main';
import { Perfil } from './SideBarComponents/Perfil/Perfil';

function HomeScreen({ userid, username, email }) {
  return <Main userid={userid} username={username} email={email} />;
} 

function PetShopMaps() {
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <Text style={{ marginTop: 40, marginBottom: 40, fontWeight: 'bold', fontSize: 18 }}>
        Pet Shops próximos a você
      </Text>
      <PetShopMapsComponent />
    </View>
  );
}

function MatchPetMain() {
  return (
    <MatchPetMainScreen />
  )
}

function SideBar({ userid, username, email, nav }) {
  // console.log('Dentro do SideBar => ', userid)
  return (
      <Drawer.Navigator 
        useLegacyImplementation
        initialRouteName="Principal"
        screenOptions={{
          drawerStyle: { 
            backgroundColor: drawerNavigatorBg,
          }, 
          drawerLabelStyle: {
            color: '#fff'
          },
        }}
      >
        <Drawer.Screen 
          name="Principal"
          options={drawerScreenOptions}
        >
          {() => <HomeScreen userid={userid} />}
        </Drawer.Screen>

        <Drawer.Screen 
          name="Perfil"
          options={drawerScreenOptions}
        >
          {() => <Perfil userid={userid} nav={nav} />}
        </Drawer.Screen>

        <Drawer.Screen 
          name="Pet Shops" 
          component={PetShopMaps}
          options={drawerScreenOptions} 
        />
        <Drawer.Screen 
          name="Match Pet" 
          component={MatchPetMain} 
          options={drawerScreenOptions}
        />
      </Drawer.Navigator>
  );
}

const Drawer = createDrawerNavigator();

export default function Home({ navigation, route }) {
  // const route = useRoute();
  const user = route.params.user;

  // console.log('USER => ', user)

  return (
    <SideBar userid={user.user_id} nav={navigation} />
  );
}