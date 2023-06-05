import React, { useState } from 'react';
import { Text, View, Modal, TouchableOpacity, ScrollView, Switch } from 'react-native';

import { styles } from './Styles';
import { DatabaseConnection } from '../../../../src/database/database-connection';

export default function PetModal({ modalVisible, pet, onClose }) {
  const [isOn, setIsOn] = useState(pet.is_donating === 0);

  const toggleSwitch = () => {
    setIsOn(!isOn);

    var idPet = pet.pet_id;
    console.log(idPet);
    if (isOn === true){
        console.log('zero')
        // db.transaction((tx) => {
        //     tx.executeSql(
        //         'UPDATE table_pets SET \'1\' WHERE pet_id = ?',
        //         [idPet]
        //         )
        //     })
    }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={modalVisible}>
      <View style={styles.modalBlur}>
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalHeaderText}>Informações do seu Pet</Text>
          </View>

          <ScrollView style={styles.modalContent} contentContainerStyle={{ alignItems: 'center' }}>
            <Text>Nome: {pet.pet_name}</Text>
            <Text>Raça: {pet.pet_race}</Text>

            <View style={styles.viewButtons}>
              <TouchableOpacity
                style={styles.buttonClose}
                onPress={() => {
                  onClose();
                }}
              >
                <Text style={styles.buttonText}>Fechar</Text>
              </TouchableOpacity>

              <View style={styles.buttonSwitch}>
                <Text>Disponível para adoção?</Text>
                <Switch onValueChange={toggleSwitch} value={isOn} />
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
