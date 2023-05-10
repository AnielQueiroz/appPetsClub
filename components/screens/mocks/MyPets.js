import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, Dimensions, Modal, Alert, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Picker } from '@react-native-picker/picker';

const racasDisponiveis = ['Poodle', 'Labrador', 'Bulldog', 'Golden Retriever', 'Vira-lata'];
const { width } = Dimensions.get('window');

import PetModal from './PetModal/PetModal';
import { styles } from './styles/Styles';

export default function MyPets({ route }) {
    const { username, email } = route.params;
    const [pets, setPets] = useState([]);
    const [userFounded, setUserFounded] = useState('');
    const [petName, setPetName] = useState('');
    const [selectedPet, setSelectedPet] = useState('');
    const [selectedPetInfo, setSelectedPetInfo] = useState(null);

    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const getPets = async () => {
            try {
                // Obtém a lista de usuários atual do AsyncStorage
                const users = await AsyncStorage.getItem('users');
                const parsedUsers = JSON.parse(users);

                // Procura o usuário com o email fornecido
                const existingUser = parsedUsers.find(user => user.email === email);

                if (existingUser) {
                    // Armazena os pets do usuário no estado
                    setPets(existingUser.pets);
                } else {
                    console.log(`Usuário com o email ${email} não encontrado!`);
                }
            } catch (error) {
                console.log(error);
            }
        }

        getPets();
    }, []);

    // Adiciona um novo pet a um usuário existente com base no email
    const addNewPetToUser = async (email, newPet) => {
        try {
            // Obtém a lista de usuários atual do AsyncStorage
            const users = await AsyncStorage.getItem('users');
            const parsedUsers = JSON.parse(users);

            // Procura o usuário com o email fornecido
            const existingUser = parsedUsers.find(user => user.email === email);

            if (existingUser) {
                // Adiciona o novo pet ao perfil do usuário
                existingUser.pets.push(newPet);

                setUserFounded(existingUser);

                // Armazena a lista de usuários atualizada no AsyncStorage
                await AsyncStorage.setItem('users', JSON.stringify(parsedUsers));

                // Atualiza o estado dos pets do usuário
                setPets(existingUser.pets);

                Alert.alert('Aviso', 'Salvo com sucesso!');
                setPetName('');
                setModalVisible(false);
            } else {
                console.log(`Usuário com o email ${email} não encontrado!`);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const removePetFromUser = async (email, petToRemove) => {
        try {
            const users = await AsyncStorage.getItem('users');
            const parsedUsers = JSON.parse(users);
    
            const existingUser = parsedUsers.find(user => user.email === email);
    
            if(existingUser){
                // Remove o pet do perfil do usuário
                existingUser.pets = existingUser.pets.filter(pet => pet !== petToRemove);
                
                // Armazena a lista de usuários atualizada no AsyncStorage
                await AsyncStorage.setItem('users', JSON.stringify(parsedUsers));
    
                // Atualiza o estado dos pets do usuário
                setPets(existingUser.pets);
                console.log('existingUser: ', existingUser)
            } else {
                console.log(`Usuário com o email ${email} não encontrado!`);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const openPetModal = (pet) => {
        setSelectedPetInfo(pet);
        setModalVisible(true);
    }

    return (
        <View style={styles.container}>
            <FlatList
                style={styles.flatList}
                data={pets}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                    <View style={styles.cardPets}>
                        <TouchableOpacity key={index}onPress={() => openPetModal(item)}>
                            {/* <Text key={index}>Pet {index + 1}: {item.nome} - {item.raca}</Text> */}
                            <Text style={styles.textFlatList}>Nome: {item.nome}</Text>
                            <Text style={styles.textFlatList}>Raça: {item.raca}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={()=> {
                                Alert.alert(
                                    'Aviso',
                                    `Tem certeza de que deseja excluir ${item.nome}?`,
                                    [
                                        {
                                            text: 'Não',
                                            style: 'cancel'
                                        },
                                        {
                                            text: 'Sim',
                                            onPress: async () => {
                                                await removePetFromUser(email, item);
                                            }
                                        }
                                    ]
                                )
                            }}
                        >
                            <Icon name="trash" size={30} color="red"/>
                        </TouchableOpacity>
                    </View>
                )}
            />

            {selectedPetInfo && (
                <PetModal 
                    visible={modalVisible}
                    selectedPetInfo={selectedPetInfo}
                    pet={selectedPetInfo}
                    onClose={() => {
                        setModalVisible(false);
                        setSelectedPetInfo(null);
                    }}
                />
            )}

            <Modal
                animationType='slide'
                transparent={true}
                visible={modalVisible && !selectedPetInfo}
            >
                <View style={styles.modalBlur}>
                    <View style={styles.modal}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalHeaderText}>Cadastrar novo pet</Text>
                        </View>

                        <ScrollView style={styles.modalContent} contentContainerStyle={{ alignItems: 'center' }}>
                            <View style={styles.viewInput}>
                                <Text style={styles.titleInputModal}>Nome do seu pet</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Nome do seu pet"
                                    value={petName}
                                    onChangeText={setPetName}
                                    >
                                </TextInput>
                            </View>

                            <Picker
                                style={{ width: '70%', backgroundColor: '#f2f2f2', borderRadius: 60, marginBottom: 20 }}
                                selectedValue={selectedPet}
                                onValueChange={(itemValue, itemIndex) => setSelectedPet(itemValue)}
                            >
                                {racasDisponiveis.map((raca, index) => (
                                    <Picker.Item key={index} label={raca} value={raca} />
                                ))}
                            </Picker>

                            <View style={styles.viewButtons}>
                                <TouchableOpacity
                                    style={styles.buttonAdd}
                                    onPress={() => addNewPetToUser(email, { nome: petName, raca: selectedPet })}
                                >
                                    <Text style={styles.buttonText}>Salvar</Text>
                                </TouchableOpacity>
                                
                                <TouchableOpacity
                                    style={styles.buttonClose}
                                    onPress={() => setModalVisible(false)}
                                    >
                                    <Text style={styles.buttonText}>Fechar</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {!modalVisible && (
                <TouchableOpacity
                    style={styles.buttonAdd}
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={styles.buttonText}>Cadastrar meu pet</Text>
                </TouchableOpacity>
            )}

        </View>
    );
}


