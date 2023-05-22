import React from 'react';
import { View, Text, SafeAreaView, ScrollView, Image, Linking, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import { styles } from './styles';

const PetDetailsScreen = ({ route }) => {
  const { pet, petLocation } = route.params;
  console.log(petLocation);

  const handleTwitterPress = () => {
    // Verificar se o aplicativo do Twitter está instalado
    Linking.canOpenURL('twitter://user?screen_name=' + pet.twitter).then(supported => {
      if (supported) {
        // Abrir o perfil do usuário no aplicativo do Twitter
        Linking.openURL('twitter://user?screen_name=' + pet.twitter);
      } else {
        // Abrir o perfil do usuário no navegador
        Linking.openURL('https://twitter.com/' + pet.twitter);
      }
    });
  };

  return (
    <SafeAreaView style={styles.containerPetDetails}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.viewImgPetDetails}>
          <Image style={styles.imagePetDetails} source={{ uri: pet.photo }} />
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.heading}>Detalhes do Pet:</Text>
          <Text style={styles.label}>Nome do Pet:</Text>
          <Text style={styles.value}>{pet.namePet}</Text>
          <Text style={styles.label}>Raça do Pet:</Text>
          <Text style={styles.value}>{pet.race}</Text>
          <Text style={styles.label}>Categoria:</Text>
          <Text style={styles.value}>{pet.category}</Text>
          <Text style={styles.label}>Gênero:</Text>
          <Text style={styles.value}>{pet.genus}</Text>
          <Text style={styles.label}>Localização:</Text>
          <Text style={styles.value}>{petLocation}</Text>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.heading}>Detalhes do Dono:</Text>
          <Text style={styles.label}>Nome do Guardião:</Text>
          <Text style={styles.value}>{pet.nameGuardian}</Text>
          <Text style={styles.label}>Twitter:</Text>
          <TouchableOpacity onPress={handleTwitterPress} style={styles.twitterContainer}>
            <Icon name="twitter" size={20} color="#1DA1F2" style={styles.icon} />
            <Text style={styles.twitterText}>{pet.twitter}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PetDetailsScreen;
