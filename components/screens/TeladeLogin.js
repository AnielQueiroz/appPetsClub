import React, { useState } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Alert,
  ScrollView,
} from 'react-native';

import { DatabaseConnection } from '../../src/database/database-connection';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { validarUsername, validarPassword } from '../../utils';

import { globalStyles } from '../../styles/GlobalStyles';

const db = DatabaseConnection.getConnection();

export default function TelaDeLogin({ navigation }) {
  const [username, setUsername] = useState('');
  const [erroUsername, setErroUsername] = useState(null);
  const [password, setPassword] = useState('');
  const [erroPassword, setErroPassword] = useState(null);
  const [users, setUsers] = useState({});

  function handleUsernameChange(text) {
    setErroUsername(null); // Limpar o erro anterior
    const erroUsername = validarUsername(text);
    setUsername(text);
    setErroUsername(erroUsername);
  }

  function handlePasswordChange(text) {
    setErroPassword(null); // Limpar o erro anterior
    const erroPassword = validarPassword(text);
    setPassword(text);
    setErroPassword(erroPassword);
  }

  const validateUser = async (username, password) => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM table_users WHERE user_name = ? AND user_password = ?',
          [username, password],
          (tx, results) => {
            if (results.rows.length > 0) {
              const foundUser = results.rows.item(0);
              resolve(foundUser); // Usuário válido
            } else {
              resolve(null); // Usuário inválido
            }
          },
          (error) => {
            reject(error);
          }
        )
      })
    })
  }

  const handleLoginPress = () => {
    if (username === ''){
      setErroUsername('Preencha o usuário!');
    }
    if (password === ''){
      setErroPassword('Preencha a senha');
      return;
    }

    validateUser(username, password)
      .then((foundUser) => {
        if (foundUser) {
          // Alert.alert('Opa', 'Encontrado!')
          navigation.replace('Home', {user: foundUser});
        } else {
          Alert.alert('Erro', 'Nome de usuário ou senha incorretos. Tente novamente.');
        }
      })
      .catch((error) => {
        console.log('Ocorreu um erro ao validar o usuário:', error);
        Alert.alert('Erro', 'Ocorreu um erro ao validar o usuário');
      })
  }

  return (
    <ImageBackground
      source={require('../../assets/bgImage.jpg')}
      style={globalStyles.bgImage}>
      <ScrollView style={globalStyles.containers} contentContainerStyle={{ alignItems: 'center' }} showsVerticalScrollIndicator={false}>
        <Text style={globalStyles.title}>Tela de Login</Text>

        <View style={globalStyles.viewInputs}>
          <Text style={globalStyles.titleInput}>Nome de usuário:</Text>
          <TextInput
            style={globalStyles.input}
            placeholder="Nome de usuário"
            value={username}
            onChangeText={handleUsernameChange}
          />
          {erroUsername && <Text style={globalStyles.erroMsg}>{erroUsername}</Text>}

          <Text style={globalStyles.titleInput}>Senha:</Text>
          <TextInput
            style={globalStyles.input}
            placeholder="Senha"
            value={password}
            onChangeText={handlePasswordChange}
            secureTextEntry={true}
          />
          {erroPassword && <Text style={globalStyles.erroMsg}>{erroPassword}</Text>}
        </View>
        <TouchableOpacity
          style={globalStyles.buttom}
          activeOpacity={0.7}
          onPress={handleLoginPress}
          >
          <Icon name="paw" size={30} color="#fff" />
          <Text style={globalStyles.textButtom}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Tela de Cadastro')}>
          <Text style={globalStyles.textDownButtom}>Criar conta</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}
