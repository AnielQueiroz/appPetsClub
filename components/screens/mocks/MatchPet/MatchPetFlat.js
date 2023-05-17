import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Text, View, TouchableOpacity } from 'react-native';
import { styles } from './styles';
import Icon from 'react-native-vector-icons/FontAwesome';

const MatchPetFlat = ({ navigation }) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

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

  const openPetDetails = (pet) => {
    navigation.navigate('Pet Details', { pet: pet });
  };

  useEffect(() => {
    getPets();
  }, []);

  return (
    <View style={{ flex: 1, padding: 24 }}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          style={styles.flatList}
          data={data}
          keyExtractor={({ id }) => id}
          renderItem={({ item }) => (
            <TouchableOpacity
                onPress={() => openPetDetails(item)}
                activeOpacity={0.9}
            >
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
                </View>
            </TouchableOpacity>
          )}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default MatchPetFlat;
