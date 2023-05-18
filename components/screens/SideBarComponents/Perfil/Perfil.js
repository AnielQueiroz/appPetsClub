import React, { useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { globalStyles } from '../../../../styles/GlobalStyles';
import Icon from 'react-native-vector-icons/Feather';
import { stylesPerfil } from './stylesPerfil';

import EditProfile from './EditProfile';
import { DatabaseConnection } from '../../../../src/database/database-connection';

const db = DatabaseConnection.getConnection();

export function Perfil({ userid, nav }) {
  const [profileImage, setProfileImage] = useState(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
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
                console.log(
                  'Nenhuma imagem de perfil encontrada para o usuário'
                );
              }
            } catch (error) {
              // Trata o erro ao acessar o resultado do banco de dados
              console.log(
                'Erro ao acessar o resultado do banco de dados:',
                error
              );
            }
          }
        );
      });
    };

    loadProfileImage(); // Chama a função diretamente no useEffect
  }, [userid]);

  useFocusEffect(
    React.useCallback(() => {
      loadUsers();
    })
  );

  const loadUsers = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT user_name, user_email FROM table_users WHERE user_id = ?',
        [userid],
        (tx, res) => {
          if (res.rows.length > 0) {
            const user = res.rows.item(0);
            setUsername(user.user_name);
            setEmail(user.user_email);
          }
        }
      );
    });
  };

  const handleLogout = async () => {
    nav.replace('Tela de Login');
  };

  const selectImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permissão necessária',
          'Por favor, permita o acesso à biblioteca de mídia para selecionar uma imagem.'
        );
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
  };

  return (
    <View style={stylesPerfil.container}>
      {editingProfile ? (
        // Tela de edição do perfil
        <EditProfile
          toggleEditingProfile={toggleEditingProfile}
          userid={userid}
        />
      ) : (
        // Tela de exibição do perfil
        <View style={stylesPerfil.container}>
          <ScrollView
            style={stylesPerfil.scrollViewContent}
            contentContainerStyle={{ alignItems: 'center' }}>
            <TouchableOpacity style={stylesPerfil.profileImageContainer}>
              {profileImage ? (
                <Image
                  source={{ uri: profileImage }}
                  style={stylesPerfil.profileImage}
                />
              ) : (
                <View>
                  <Text style={{ alignSelf: 'center', marginVertical: 50 }}>
                    {profileImage !== null
                      ? 'Clique aqui para selecionar uma foto'
                      : 'Nenhuma foto de perfil encontrada'}
                  </Text>
                </View>
              )}
              <TouchableOpacity
                style={stylesPerfil.selectImageIconContainer}
                onPress={selectImage}>
                <Icon name="camera" size={24} color="#ffffff" />
              </TouchableOpacity>
            </TouchableOpacity>
            <View style={stylesPerfil.profileInfoContainer}>
              <Text style={stylesPerfil.usernameText}>Olá, {username}</Text>
              <Text style={stylesPerfil.emailText}>Email: {email}</Text>
            </View>
            <TouchableOpacity
              style={globalStyles.buttonLogout}
              onPress={handleLogout}>
              <Icon name="log-out" size={24} color="red" />
              <Text style={globalStyles.labelLogout}>Sair</Text>
            </TouchableOpacity>
          </ScrollView>

          <TouchableOpacity
            style={stylesPerfil.editButton}
            onPress={toggleEditingProfile}>
            <Icon name="edit" size={24} color="white" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
