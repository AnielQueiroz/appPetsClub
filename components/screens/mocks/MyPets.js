import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, Dimensions, Modal, Alert, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Picker } from '@react-native-picker/picker';

const racasDisponiveis = ['Poodle', 'Labrador', 'Bulldog', 'Golden Retriever', 'Vira-lata'];
const { width } = Dimensions.get('window');

import PetModal from './PetModal/PetModal';
import { styles } from './styles/Styles';

import { DatabaseConnection } from '../../../src/database/database-connection';

const db = DatabaseConnection.getConnection();

export default function MyPets({ route }) {
    const { userid, username, email } = route.params;
    // console.log('Dentro do My Pets => ', userid);

    const [pets, setPets] = useState([]);
    const [petName, setPetName] = useState('');
    const [selectedPet, setSelectedPet] = useState('');
    const [selectedPetInfo, setSelectedPetInfo] = useState(null);

    const [modalVisible, setModalVisible] = useState(false);

    const loadPets = () => {
        db.transaction(function (txn) {
            txn.executeSql(
                'SELECT * FROM table_pets WHERE user_id = ?',
                [userid],
                function (tx, res) {
                    var petsTemp = [];
                    
                    for (let i = 0; i < res.rows.length; i++) {
                        var pet = res.rows.item(i);
                        petsTemp.push(pet);
                        setPets(petsTemp)
                    }
                    
                    // console.log('PETS => ', pets);
                }
                )
            })
    }

    useEffect(() => {
        loadPets();
    }, []);

    // Adiciona um novo pet a um usuário existente com base no id do usuário
    let insertPet = (petName, userid) => {
        // console.log(petName, userid);
        if (!petName) {
            Alert.alert('Aviso', 'Seu pet precisa de um nome.');
            return;
        }
        db.transaction(function (tx) {
            tx.executeSql(
                'INSERT INTO table_pets (pet_name, user_id) VALUES (?, ?)',
                [petName, userid],
                (tx, results) => {
                    console.log('Results => ', results.rowsAffected);
                    if (results.rowsAffected > 0) {
                        Alert.alert('Sucesso', 'Seu pet foi adicionado a lista!');
                        setPetName('');
                        loadPets();
                        // setPets(prevPets => [...prevPets, { pet_name: petName, user_id: userid}]);
                        setModalVisible(false);
                    } else {
                        Alert.alert('Erro', 'Falha ao tentar adicionar o pet');
                    }
                }
            )
        })
    }

    // Remove o pet de um usuário existente com base no id do usuário e do pet
    let removePet = (userid, petid) => {
        db.transaction(function (tx) {
            tx.executeSql(
                'DELETE FROM table_pets WHERE user_id = ? AND pet_id = ?',
                [userid, petid],
                (tx, results) => {
                    if(results.rowsAffected > 0) {
                        Alert.alert('Sucesse', 'Pet removido!');
                        loadPets();
                    } else {
                        Alert.alert('Erro', 'Falha ao remover o pet');
                    }
                }
            )
        })
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
                            <Text style={styles.textFlatList}>Nome: {item.pet_name}</Text>
                            <Text style={styles.textFlatList}>Raça: {item.raca}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={()=> {
                                Alert.alert(
                                    'Aviso',
                                    `Tem certeza de que deseja excluir ${item.pet_name}?`,
                                    [
                                        {
                                            text: 'Não',
                                            style: 'cancel'
                                        },
                                        {
                                            text: 'Sim',
                                            onPress: async () => {
                                                await removePet(userid, item.pet_id);
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
                                    onPress={() => insertPet(petName, userid) }
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


