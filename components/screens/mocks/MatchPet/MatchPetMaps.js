import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Image,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import MapView, { Callout, Marker } from 'react-native-maps';
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
} from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';

function MatchPet({ navigation }) {
  const [pets, setPets] = useState([]);
  const [currentRegion, setCurrentRegion] = useState(null);
  const [race, setRace] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [searching, setSearching] = useState(false);
  const [filteredPets, setFilteredPets] = useState([]);

  function fetchPets() {
    fetch('https://my-json-server.typicode.com/TarcisioJack/petsclub/pets/')
      .then((response) => {
        response.json().then((data) => {
          setPets(data);
        }).catch((error) => {
          console.error(error);
          if (isAlertDisplayed) { // verificar se o Alert já foi exibido
            setSearching(false);
          } else {
            Alert.alert('Erro', 'Ocorreu um erro ao carregar os dados. Tente novamente mais tarde.');
            setIsAlertDisplayed(true); // definir para true quando o Alert é exibido
            setSearching(false);
          }
        });
      })
      .catch((error) => {
        console.error(error);
        if (isAlertDisplayed) { // verificar se o Alert já foi exibido
          setSearching(false);
        } else {
          Alert.alert('Erro', 'Ocorreu um erro ao carregar os dados. Tente novamente mais tarde.');
          setIsAlertDisplayed(true); // definir para true quando o Alert é exibido
          setSearching(false);
        }
      });
  }

  function loadInitialPosition() {
    requestForegroundPermissionsAsync()
      .then(({ granted }) => {
        if (granted) {
          return getCurrentPositionAsync({ enableHighAccuracy: true });
        }
      })
      .then(({ coords }) => {
        const { latitude, longitude } = coords;

        setCurrentRegion({
          latitude,
          longitude,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function handleRegionChanged(region) {
    setCurrentRegion(region);
  }

  function handleButtonClick() {
    setSearching(true);

    let timer = setTimeout(() => {
      Alert.alert('Tempo excedido', 'Tente novamente!');
      setSearching(false);
      timer = null;
    }, 5000);

    loadInitialPosition();
    fetchPets();
    setShowMap(true);
    
    if(timer) {
      clearTimeout(timer);
    }
  }

  function handleLoadButtonClick() {
    if (race.length === 0) {
      Alert.alert('Erro', 'Por favor insira uma raça para filtrar!');
      return;
    }

    const filtered = pets.filter((pet) => pet.race === race);

    if (filtered.length === 0) {
      Alert.alert('Nenhum resultado', `Não encontramos pets da raça ${race}`);
      return;
    }

    setFilteredPets(filtered);
  }
 
  if (!currentRegion || !showMap) {
    return (
      <View style={styles.container}>
        {searching && (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
        </View>
        )}
        <TouchableOpacity onPress={handleButtonClick} style={styles.button}>
          <Text style={styles.buttonText}>Começar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      {showMap && (
        <>
          <MapView
            onRegionChangeComplete={handleRegionChanged}
            initialRegion={currentRegion}
            showsUserLocation={true}
            style={styles.map}>
            {pets.map((pet) => (
              <Marker
                key={pet.id}
                coordinate={{
                  latitude: pet.location.coordinates[0],
                  longitude: pet.location.coordinates[1],
                }}>
                <Image style={styles.photo} source={{ uri: pet.photo }} />

                <Callout
                  onPress={() => {
                    navigation.navigate('Profile', {
                      profile_username: pet.twitter,
                    });
                  }}>
                  <View style={styles.callout}>
                    <Text style={styles.nameGuardian}>Guardião: {pet.nameGuardian}</Text>
                    <Text style={styles.namePet}>Pet: {pet.namePet}</Text>
                    <Text style={styles.petCategory}>Raça: {pet.race}</Text>
                    <Text style={styles.petCategory}>Sexo: {pet.genus}</Text>
                    <Text style={styles.petCategory}>Categoria: {pet.category}</Text>
                  </View>
                </Callout>
              </Marker>
            ))}
          </MapView>

          <View style={styles.searchForm}>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar Pets por raça..."
              placeholderTextColor="999"
              autoCapitalize="words"
              autoCorrect={false}
              value={race}
              onChangeText={setRace}
            />

            <TouchableOpacity onPress={handleLoadButtonClick} style={styles.loadButton}>
              <MaterialIcons name="my-location" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    flex: 1,
  },
  button: {
    marginTop: 16,
    backgroundColor: '#000',
    padding: 20,
    borderRadius: 8,
    marginBottom: 25,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  photo: {
    width: 54,
    height: 54,
    borderRadius: 4,
    borderWidth: 4,
    borderColor: '#FFF',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    opacity: 0.5,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1
  },
  callout: {
    width: 260,
  },

  nameGuardian: {
    fontWeight: 'bold',
    fontSize: 16,
  },

  petCategory: {
    color: '#666',
    marginTop: 5,
  },

  namePet: {
    marginTop: 5,
  },

  searchForm: {
    position: 'absolute',
    bottom: 20,
    //top: 20,
    left: 20,
    right: 20,
    zIndex: 5,
    flexDirection: 'row',
  },

  searchInput: {
    flex: 1,
    height: 50,
    backgroundColor: '#FFF',
    color: '#333',
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 4,
      height: 4,
    },
    elevation: 2,
  },

  loadButton: {
    width: 50,
    height: 50,
    backgroundColor: '#005EFF',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
  },
});

export default MatchPet;
