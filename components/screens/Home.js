import * as React from 'react';
import { View, ImageBackground, Text, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useRoute } from '@react-navigation/native';
import { globalStyles } from '../../styles/GlobalStyles';
import Icon from 'react-native-vector-icons/Feather';

import PetShopMapsComponent from './mocks/PetsShopMaps/PetShopMapsComponent';
import Main from './mocks/Main';
import MatchPetMainScreen from './mocks/MatchPet/Main';

function HomeScreen({ userid, username, email }) {
  return <Main userid={userid} username={username} email={email} />;
}

function Perfil({ userid, username, email, nav }) {
  const handleLogout = async () => {
    nav.replace('Tela de Login');
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text>ID: {userid}</Text>
      <Text>Usuário: {username}</Text>
      <Text>Email: {email}</Text>

      <TouchableOpacity
        style={globalStyles.buttonLogout}
        onPress={handleLogout}>
        <Icon name="log-out" size={24} color="red" />
        <Text style={globalStyles.labelLogout}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
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
    <Drawer.Navigator useLegacyImplementation initialRouteName="Principal">
      <Drawer.Screen name="Principal">
        {() => <HomeScreen userid={userid} username={username} email={email} />}
      </Drawer.Screen>

      <Drawer.Screen name="Perfil">
        {() => <Perfil userid={userid} username={username} email={email} nav={nav} />}
      </Drawer.Screen>

      <Drawer.Screen name="Pet Shops" component={PetShopMaps} />
      <Drawer.Screen name="Match Pet" component={MatchPetMain} />
    </Drawer.Navigator>
  );
}

const Drawer = createDrawerNavigator();

export default function Home({ navigation, route }) {
  // const route = useRoute();
  const user = route.params.user;

  // console.log('USER => ', user)

  return (
    <>
      <StatusBar style="dark" />
      <SideBar userid={user.user_id} username={user.user_name} email={user.user_email} nav={navigation} />
    </>
  );
}
