import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ScrollView,
  Alert,
  BackHandler,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import { DatabaseConnection } from '../../../../src/database/database-connection';

import { stylesEditPerfil } from './stylesEditProfile';

import {
  validarUsername,
  validarEmail,
  validarPassword,
} from '../../../../utils';

const db = DatabaseConnection.getConnection();

const EditProfile = ({ toggleEditingProfile, userid }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const handleBackButton = useCallback(() => {
    toggleEditingProfile();
    return true;
  }, [toggleEditingProfile]);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButton);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
    };
  }, [handleBackButton]);

  let updateUserData = (fieldsToUpdate) => {
    const { username, email, password } = fieldsToUpdate;

    // Validação do campo de username
    if (username) {
      const validarNome = validarUsername(username);
      if (validarNome) {
        Alert.alert('Erro', validarNome);
        return; // Retorna caso haja erro de validação
      }
    }

    // Validação do campo de email
    if (email) {
      const erroEmail = validarEmail(email);
      if (erroEmail) {
        Alert.alert('Erro', erroEmail);
        return; // Retorna caso haja erro de validação
      }
    }

    // Validação do campo de senha
    if (password) {
      const erroSenha = validarPassword(password);
      if (erroSenha) {
        Alert.alert('Erro', erroSenha);
        return; // Retorna caso haja erro de validação
      }
    }

    // Atualização dos dados no banco de dados
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM table_users WHERE user_id = ?',
        [userid],
        (tx, results) => {
          if (results.rows.length > 0) {
            const user = results.rows.item(0);
            if (user.user_name === username) {
              Alert.alert('Aviso', 'Já existe um cadastro com esse usuário.');
              return;
            }
            if (user.user_email === email) {
              Alert.alert('Aviso', 'Já existe um cadastro com esse email.');
              return;
            } else {
              db.transaction((tx) => {
                let query = 'UPDATE table_users SET';
                let params = [];

                if (username) {
                  query += ' user_name = ?,';
                  params.push(username);
                }

                if (email) {
                  query += ' user_email = ?,';
                  params.push(email);
                }

                if (password) {
                  query += ' user_password = ?,';
                  params.push(password);
                }

                if (params.length === 0) {
                  Alert.alert('Aviso', 'Nenhum campo foi atualizado.');
                  toggleEditingProfile();
                  return; // Retorna se nenhum campo foi atualizado
                }

                query = query.slice(0, -1); // Remover a vírgula extra no final
                query += ' WHERE user_id = ?';
                params.push(userid);

                tx.executeSql(query, params, (tx, results) => {
                  console.log('Results Update', results.rowsAffected);
                  if (results.rowsAffected > 0) {
                    Alert.alert('Sucesso', 'Dados atualizados com sucesso!');
                    toggleEditingProfile();
                  } else {
                    Alert.alert('Erro', 'Falha ao atualizar dados');
                  }
                });
              });
            }
          }
        }
      );
    });
  };

  function dataToEditProfile(username, email, password) {
    const fieldsToUpdate = {
      username,
      email,
      password,
    };

    updateUserData(fieldsToUpdate);
  }

  return (
    <SafeAreaView style={stylesEditPerfil.editProfileContainer}>
      <ScrollView
        style={{ flex: 1, width: '100%' }}
        contentContainerStyle={{ alignItems: 'center' }}
        showsVerticalScrollIndicator={false}>
        {/* Campos de edição do perfil */}
        <View style={stylesEditPerfil.viewInputs}>
          <Text style={stylesEditPerfil.titleInput}>Nome de usuário:</Text>
          <TextInput
            style={stylesEditPerfil.input}
            placeholder="Nome de usuário"
            value={username}
            onChangeText={setUsername}
          />

          <Text style={stylesEditPerfil.titleInput}>Email:</Text>
          <TextInput
            style={stylesEditPerfil.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={stylesEditPerfil.titleInput}>Senha:</Text>
          <TextInput
            style={stylesEditPerfil.input}
            placeholder="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
          />
        </View>

        <View style={stylesEditPerfil.buttonsContainer}>
          <TouchableOpacity
            style={stylesEditPerfil.saveButton}
            onPress={() => {
              dataToEditProfile(username, email, password);
            }}>
            <Icon name="save" size={24} color="white" />
            <Text style={stylesEditPerfil.buttonText}>Salvar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={stylesEditPerfil.cancelButton}
            onPress={toggleEditingProfile}>
            <Icon name="arrow-left" size={24} color="white" />
            <Text style={stylesEditPerfil.buttonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfile;
