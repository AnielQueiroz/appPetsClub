import React, { useState } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Alert,
  ScrollView
} from 'react-native';

// import Fingerprint from 'react-native-fingerprint';

import { DatabaseConnection } from '../../src/database/database-connection';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { validarEmail, validarUsername, validarPassword } from '../../utils';
import { globalStyles } from '../../styles/GlobalStyles';

const db = DatabaseConnection.getConnection();

export default function TeladeLogin({ navigation }) {
  const [username, setUsername] = useState('');
  const [erroUsername, setErroUsername] = useState(null);
  const [email, setEmail] = useState('');
  const [erroEmail, setErroEmail] = useState(null);
  const [password, setPassword] = useState('');
  const [erroPassword, setErroPassword] = useState(null);
  const [biometricData, setBiometricData] = useState('');

  function handleEmailChange(text) {
    const erroEmail = validarEmail(text);
    setErroEmail(erroEmail);
    setEmail(text);
  
    if (text === '') {
      setErroEmail('Preencha o email');
    }
  }
  
  function handleUsernameChange(text) {
    const erroUsername = validarUsername(text);
    setErroUsername(erroUsername);
    setUsername(text);
  
    if (text === '') {
      setErroUsername('Preencha o usuário');
    }
  }
  
  function handlePasswordChange(text) {
    const erroPassword = validarPassword(text);
    setErroPassword(erroPassword);
    setPassword(text);
  
    if (text === '') {
      setErroPassword('Preencha a senha');
    }
  }

  function captureBiometricData() {
    Alert.alert('Aaah', 'Desisto')
    // Fingerprint.scan().then(result => {
    //   console.log('BIOMETRIA => ', result.data)
    //   setBiometricData(result.data);
    // });
  }

  function handleCadastro() {
    if( email === ''){
      setErroEmail('Preencha o email');
    }
    if ( username === ''){
      setErroUsername('Preencha o usuário');
    }
    if ( password === ''){
      setErroPassword('Preencha a senha');
      return;
    }

    if (erroUsername){
      return;
    }
    if (erroEmail) {
      return;
    }
    if (erroPassword) {
      return;
    }
  
    db.transaction(function (tx) {
      tx.executeSql(
        'SELECT * FROM table_users WHERE user_name = ? OR user_email = ?',
        [username, email],
        (tx, results) => {
          if (results.rows.length > 0) {
            const user = results.rows.item(0);
            if (user.user_email === email) {
              setErroEmail('Já existe um cadastro com esse email.')
            } 
            else if (user.user_name === username) {
              setErroUsername('Já existe um cadastro com esse usuário.')
            }
          } else {
            db.transaction(function (tx) {
              tx.executeSql(
                'INSERT INTO table_users (user_name, user_email, user_password, biometricData) VALUES (?,?,?,?)',
                [username, email, password, biometricData],
                (tx, results) => {
                  console.log('Results: ', results.rowsAffected);
                  if (results.rowsAffected > 0) {
                    Alert.alert(
                      'Sucesso',
                      'Cadastro realizado com sucesso!',
                      [
                        {text: 'Ok',
                      onPress: () => navigation.navigate('Tela de Login'),
                    },
                      ],
                      { cancelable: false }
                    );
                  } else{
                    console.log('Erro ao tentar registrar usuário:', results);
                    Alert.alert('Erro', 'Ocorreu um erro ao registrar o usuário. Por favor, tente novamente.');
                  } 
                }
              );
            });
          }
        }
      )
    })
  }

  return (
    <ImageBackground
      source={require('../../assets/cat2.jpg')}
      style={globalStyles.bgImage}>
      <ScrollView style={globalStyles.containers} contentContainerStyle={{ alignItems: 'center' }} showsVerticalScrollIndicator={false}>
        <Text style={globalStyles.title}>Tela de Cadastro</Text>

        <View style={globalStyles.viewInputs}>
          <Text style={globalStyles.titleInput}>Email:</Text>
          <TextInput
            style={globalStyles.input}
            placeholder="Email"
            value={email}
            onChangeText={handleEmailChange}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {erroEmail && <Text style={globalStyles.erroMsg}>{erroEmail}</Text>}

          <Text style={globalStyles.titleInput}>Usuário:</Text>
          <TextInput
            style={globalStyles.input}
            placeholder="Usuário"
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

          <Text style={globalStyles.titleInput}>Biometria (Opcional):</Text>
          <TouchableOpacity
            style={globalStyles.input}
            onPress={captureBiometricData}
          >
            <Icon style={{alignSelf: 'center'}} name='fingerprint' size={40}/>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={globalStyles.buttom}
          activeOpacity={0.7}
          onPress={handleCadastro}>
          <Icon name="paw" size={30} color="#fff" />
          <Text style={globalStyles.textButtom}>Cadastrar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Tela de Login')}>
          <Text style={globalStyles.textDownButtom}>Entrar</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}
