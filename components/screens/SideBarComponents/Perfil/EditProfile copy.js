import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, TextInput, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import { DatabaseConnection } from '../../../../src/database/database-connection';

import { stylesEditPerfil } from './stylesEditProfile';
import { globalStyles } from '../../../../styles/GlobalStyles';

import { validarUsername, validarEmail } from '../../../../utils';

const db = DatabaseConnection.getConnection();

const EditProfile = ({ saveProfileChanges, toggleEditingProfile, userid }) => {
    const [username, setUsername] = useState('');
    const [erroUsername, setErroUsername] = useState(null);
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [erroEmail, setErroEmail] = useState(null);
    const [users, setUsers] = useState([]);

    let updateUserData = (username) => {
        db.transaction(function (tx) {
          tx.executeSql(
            'SELECT * FROM table_users WHERE user_name = ?',
            [username],
            (tx, results) => {
              if (results.rows.length > 0) {
                const user = results.rows.item(0);
                if (user.user_name === username) {
                  console.log(user.user_name);
                  Alert.alert('Aviso', 'Já existe um cadastro com esse usuário.');
                }
              } else {
                db.transaction((tx) => {
                    tx.executeSql(
                        'UPDATE table_users SET user_name = ? WHERE user_id = ?',
                        [username, userid],
                        (tx, results) => {
                            console.log('Results Update Username', results.rowsAffected);
                            if (results.rowsAffected > 0) {
                                Alert.alert('Sucesso', 'Nome de usuário atualizado com sucesso!');
                            } else {
                                Alert.alert('Erro', 'Falha ao atualizar nome de usuário');
                            }
                        }
                    )
                })
              }
            }
          );
        });
      };

    function handleUsernameChange(username) {
        if(username){
            const validarNome = validarUsername(username);
            if(!validarNome){
                // se não for nulo, chama a função update
                updateUserData(username);
            }
            else {
                Alert.alert('Erro', validarNome);
            }
        }
    }

    function handleEmailChange(text) {
        if(!text){
            setErroEmail('');
            setEmail('');
        } else {
            const erroEmail = validarEmail(text);
            setErroEmail(erroEmail);
            setEmail(text);
        }
    }

    function test(){
        console.log(userid)
    }

  return (
    <SafeAreaView style={stylesEditPerfil.editProfileContainer}>
        <ScrollView style={{ flex: 1, width: '100%' }} contentContainerStyle={{ alignItems: 'center' }} showsVerticalScrollIndicator={false}>
            {/* Campos de edição do perfil */}
            <View style={stylesEditPerfil.viewInputs}>
                <Text style={stylesEditPerfil.titleInput}>Nome de usuário:</Text>
                <TextInput 
                    style={stylesEditPerfil.input}
                    placeholder='Nome de usuário'
                    value={username}
                    onChangeText={setUsername}
                />
                {erroUsername && <Text style={globalStyles.erroMsg}>{erroUsername}</Text>}

                <Text style={stylesEditPerfil.titleInput}>Email:</Text>
                <TextInput 
                    style={stylesEditPerfil.input}
                    placeholder='Email'
                    value={email}
                    onChangeText={handleEmailChange}
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                {erroEmail && <Text style={globalStyles.erroMsg}>{erroEmail}</Text>}

                <Text style={stylesEditPerfil.titleInput}>Senha:</Text>
                <TextInput 
                    style={stylesEditPerfil.input}
                    placeholder='Senha'
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={true}
                />
            </View>

            <View style={stylesEditPerfil.buttonsContainer}>
                <TouchableOpacity style={stylesEditPerfil.saveButton} onPress={() => saveProfileChanges({ username, password, email })}>
                    <Icon name="save" size={24} color="white" />
                    <Text style={stylesEditPerfil.buttonText}>Salvar</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={stylesEditPerfil.cancelButton} 
                    onPress={() => {handleUsernameChange(username)}}
                >
                    <Icon name="arrow-left" size={24} color="white" />
                    <Text style={stylesEditPerfil.buttonText}>Voltar</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfile;
