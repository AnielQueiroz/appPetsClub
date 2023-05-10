import React from 'react';
import { Text, View, Modal, TouchableOpacity, ScrollView } from 'react-native';

import { styles } from './Styles';

export default function PetModal({modalVisible, pet, onClose}) {
    return(
        <Modal
            animationType='slide'
            transparent={true}
            visible={modalVisible}
        >
            <View style={styles.modalBlur}>
                <View style={styles.modal}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalHeaderText}>Informações do seu Pet</Text>
                    </View>

                    <ScrollView style={styles.modalContent} contentContainerStyle={{ alignItems: 'center' }}>
                        <Text>Nome: {pet.nome}</Text>
                        <Text>Raça: {pet.raca}</Text>
                        
                        <View style={styles.viewButtons}>
                            <TouchableOpacity
                                style={styles.buttonClose}
                                onPress={() => {
                                    onClose();
                                }}
                            >
                                <Text style={styles.buttonText}>Fechar</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    )
}