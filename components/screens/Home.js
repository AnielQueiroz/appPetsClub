import React, { useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { View, Image, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { globalStyles } from '../../styles/GlobalStyles';
import Icon from 'react-native-vector-icons/Feather';

import { Dimensions } from 'react-native';
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

import { activeDrawer, drawerNavigatorBg, drawerScreenOptions } from './styles/stylesScreens';

import { DatabaseConnection } from '../../src/database/database-connection';

const db = DatabaseConnection.getConnection();

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
import { useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';

function HomeScreen({ userid, username, email }) {
  return <Main userid={userid} username={username} email={email} />;
} 

function Perfil({ userid, username, email, nav }) {
  // console.log('PERFIL ID => ', userid);

  const [profileImage, setProfileImage] = useState(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [users, setUsers] = useState(null);

  useEffect(() => {
    loadProfileImage();
  }, []);

  const loadProfileImage = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT profile_image FROM table_users WHERE user_id = ?',
        [userid],
        (tx, res) => {
          try {
            if (res.rows.length > 0) {
              const base64Image = res.rows.item(0).profile_image;
              const imageUri = base64Image;
              setProfileImage(imageUri);
            } else {
              // Caso não haja resultado encontrado no banco de dados
              console.log('Nenhuma imagem de perfil encontrada para o usuário');
            }
          } catch (error) {
            // Trata o erro ao acessar o resultado do banco de dados
            console.log('Erro ao acessar o resultado do banco de dados:', error);
          }
        }
      );
    });
  };

  // const loadUsers = () => {
  //   db.transaction((tx) => {
  //     tx.executeSql(
  //       'SELECT * FROM table_users WHERE user_id = ?',
  //       [userid],
  //       (tx, res) => {
  //         var temp = [];
  //         for (let i = 0; i < res.rows.length; i++)
  //           temp.push(res.rows.item(i));
  //           setUsers(temp);
  //           console.log('USERS => ', users);
  //         }
  //     )
  //   })
  // }
  
  const handleLogout = async () => {
    nav.replace('Tela de Login');
  };

  const selectImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'Por favor, permita o acesso à biblioteca de mídia para selecionar uma imagem.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });
      // console.log('IMAGE => ', result);

      if (!result.canceled) {
        setProfileImage(result.assets[0].uri);
        saveImageToDatabase(result.assets[0].uri);
      }
    } catch (error) {
      console.log('Erro ao selecionar a imagem:', error);
    }
  };

  const convertBlobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result;
        resolve(base64data);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(blob);
    });
  };

  const convertImageToBase64 = async (imageUri) => {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const base64data = await convertBlobToBase64(blob);
      return base64data;
    } catch (error) {
      throw new Error(`Falha ao ler a imagem: ${error}`);
    }
  };
  
  const saveImageToDatabase = async (imageUri) => {
    try {
      // Converte a imagem em base64
      const base64 = await convertImageToBase64(imageUri);
  
      // Salva a imagem no banco de dados SQLite
      db.transaction((txn) => {
        txn.executeSql(
          'UPDATE table_users SET profile_image = ? WHERE user_id = ?',
          [base64, userid],
          (tx, result) => {
            console.log('Resultado da atualização:', result);
  
            if (result.rowsAffected > 0) {
              Alert.alert('Sucesso', 'Imagem do perfil salva com sucesso.');
            } else {
              Alert.alert('Erro', 'Falha ao salvar a imagem do perfil.');
            }
          }
        );
      });
    } catch (error) {
      console.log('Erro ao salvar a imagem no banco de dados:', error);
    }
  };

  const toggleEditingProfile = () => {
    setEditingProfile(!editingProfile);
  } 

  const saveProfileChanges = () => {
    // Lógica para salvar as alterações do perfil
    toggleEditingProfile();
    setEditingProfile(!editingProfile);
  };

  return (
    <View style={styles.container}>
        {editingProfile ? (
          // Tela de edição do perfil
          <View style={styles.editProfileContainer}>
            {/* Campos de edição do perfil */}
            {/* ... */}
            <TouchableOpacity style={styles.saveButton} onPress={saveProfileChanges}>
              <Icon name="save" size={24} color="white" />
              <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={toggleEditingProfile}>
              <Icon name="arrow-left" size={24} color="white" />
              <Text style={styles.buttonText}>Voltar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Tela de exibição do perfil
          <View style={styles.container}>
            <ScrollView style={styles.scrollViewContent} contentContainerStyle={{alignItems: 'center',}}>
              <TouchableOpacity style={styles.profileImageContainer}>
                {profileImage ? (
                  <Image source={{ uri: profileImage }} style={styles.profileImage} />
                ) : (
                  <View>
                    <Text style={{ alignSelf: 'center', marginVertical: 50 }}>
                      {profileImage !== null ? 'Clique aqui para selecionar uma foto' : 'Nenhuma foto de perfil encontrada'}
                    </Text>
                  </View>
                )}
                <TouchableOpacity style={styles.selectImageIconContainer} onPress={selectImage}>
                  <Icon name="camera" size={24} color="#ffffff" />
                </TouchableOpacity>
              </TouchableOpacity>
              <View style={styles.profileInfoContainer}>
                <Text style={styles.usernameText}>Olá, {username}</Text>
                <Text style={styles.emailText}>Email: {email}</Text>
              </View>
              <TouchableOpacity style={globalStyles.buttonLogout} onPress={handleLogout}>
                <Icon name="log-out" size={24} color="red" />
                <Text style={globalStyles.labelLogout}>Sair</Text>
              </TouchableOpacity>
            </ScrollView>

            <TouchableOpacity style={styles.editButton} onPress={toggleEditingProfile}>
              <Icon name="edit" size={24} color="white" />
            </TouchableOpacity>
          </View>
        )}
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
    <>
      {/* <StatusBar style="light" /> */}
      <Drawer.Navigator 
        drawerContent={SideBar}
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
          {() => <HomeScreen userid={userid} username={username} email={email} />}
        </Drawer.Screen>

        <Drawer.Screen 
          name="Perfil"
          options={drawerScreenOptions}
        >
          {() => <Perfil userid={userid} username={username} email={email} nav={nav} />}
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
    </>
  );
}

const Drawer = createDrawerNavigator();

export default function Home({ navigation, route }) {
  // const route = useRoute();
  const user = route.params.user;

  // console.log('USER => ', user)

  return (
    <SideBar userid={user.user_id} username={user.user_name} email={user.user_email} nav={navigation} />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  scrollViewContent: {
    paddingTop: windowWidth * 0.1,
    width: windowWidth,
  },
  selectImageIconContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    padding: 5,
  },
  profileInfoContainer: {
    marginBottom: 20,
  },
  profileImageContainer: {
    width: 180,
    height: 180,
    borderRadius: 25,
    // borderBottomLeftRadius: 10,
    // borderBottomRightRadius: 10,
    overflow: 'hidden',
    marginBottom: 30,
    backgroundColor: '#f2f2f2'
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  usernameText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emailText: {
    fontSize: 16,
  },
  editButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'blue',
    borderRadius: 50,
    padding: 10,
    elevation: 2,
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  editProfileContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  saveButton: {
    backgroundColor: 'green',
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: 'red',
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
})