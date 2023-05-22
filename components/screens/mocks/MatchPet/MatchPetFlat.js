import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Text, View, TouchableOpacity } from 'react-native';
import { styles } from './styles';
import * as Location from 'expo-location';

const MatchPetFlat = ({ navigation }) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [petLocations, setPetLocations] = useState([]);

  const getPets = async () => {
    try {
      const response = await fetch('https://my-json-server.typicode.com/TarcisioJack/petsclub/pets/');
      const json = await response.json();
      setData(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const reverseGeocode = async (latitude, longitude) => {
    try {
      const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
      const bairro = geocode[0].district;
      const cidade = geocode[0].subregion;
      const uf = geocode[0].region;
  
      const address = `${bairro}, ${cidade}, ${uf}`;
      return address;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  useEffect(() => {
    getPets();

    const fetchPetLocations = async () => {
      if (data.length === 0) {
        return;
      }
  
      const petLocations = [];
      for (let i = 0; i < data.length; i++) {
        const { coordinates } = data[i].location;
        const petLocation = await reverseGeocode(coordinates[0], coordinates[1]);
        petLocations.push(petLocation);
      }
  
      setPetLocations(petLocations);
    };
  
    fetchPetLocations();
  }, [data]);

  const openPetDetails = (pet, petLocation) => {
    navigation.navigate('Pet Details', { pet: pet, petLocation: petLocation });
  };

  const renderItem = ({ item, index }) => {
    const petLocation = petLocations[index];
  
    return (
      <TouchableOpacity onPress={() => openPetDetails(item, petLocation)} activeOpacity={0.9}>
        <View style={styles.cardPets}>
          <View style={styles.viewPhoto}>
            <Image style={styles.photoPet} source={{ uri: item.photo }} />
          </View>

          <Text style={styles.textFlatTitle}>Nome:</Text>
          <Text style={styles.textFlatSubTitle}>{item.namePet}</Text>
          <Text style={styles.textFlatTitle}>Gênero:</Text>
          <Text style={styles.textFlatList}>{item.genus}</Text>
          <Text style={styles.textFlatTitle}>Raça:</Text>
          <Text style={styles.textFlatList}>{item.race}</Text>
          <Text style={styles.textFlatTitle}>Localização:</Text>
          <Text style={styles.textFlatList}>{petLocation}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, padding: 24 }}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          style={styles.flatList}
          data={data}
          keyExtractor={({ id }) => id.toString()}
          renderItem={renderItem}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default MatchPetFlat;
