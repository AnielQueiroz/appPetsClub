import React, { useState } from 'react';
import {
  ActivityIndicator,
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';

import * as Location from 'expo-location';
import MapView, { Marker, Callout } from 'react-native-maps';
import petShopIcon from '../../../../assets/patas.png';

import { APIKEY } from './config';
const MAPID = 'e4e8809747106541';

const { width } = Dimensions.get('window');

export default function PetShopMaps() {
  const [region, setRegion] = useState(null);
  const [location, setLocation] = useState(null);
  const [petShops, setPetShops] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const searchPetStoreNearby = async () => {
    let timeoutId = setTimeout(() => {
      Alert.alert('Tempo excedido', 'Tente novamente!');
      setSearching(false);
      timeoutId = null;
    }, 5000);
  
    try {
      // Busca por pets shops proximos
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.coords.latitude},${location.coords.longitude}&radius=5000&type=pet_store&key=${APIKEY}`;
      const response = await fetch(url);
      const json = await response.json();
      
      setPetShops(json.results);
  
      if (timeoutId) {
        clearTimeout(timeoutId);
        setSearching(false);
      }
    } catch (error) {
      console.log(error);
      if (timeoutId) {
        clearTimeout(timeoutId);
        Alert.alert('Erro', 'Ocorreu um erro na busca por pets shops próximos. Tente novamente!');
        setSearching(false);
      }
    }
  };
  
  const searchPetShop = async () => {
    setSearching(true);
    searchPetStoreNearby();
  };

  const handleButtonClick = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão para localização negada');
      return;
    }

    setSearching(true);
    
    let timer = setTimeout(() => {
      Alert.alert('Tempo excedido', 'Tente novamente!');
      setSearching(false);
      timer = null;
    }, 5000)

    try {
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
  
      setShowMap(true);
      setSearching(false);

      if(timer) {
        clearTimeout(timer);
        setSearching(false);
      }
    } catch (error) {
      console.log(error);
      if(timer) {
        clearTimeout(timer);
        Alert.alert('Erro', 'Tente novamente!');
        setSearching(false);
      }
    }    
  }

  function newMarker(e) {
    let dados = {
      coords: {
        latitude: e.nativeEvent.coordinate.latitude,
        longitude: e.nativeEvent.coordinate.longitude
      }
    }
  
    setLocation(dados);

    setRegion({
      latitude: e.nativeEvent.coordinate.latitude,
      longitude: e.nativeEvent.coordinate.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    })
  }

  if(!showMap){
    return (
      <View style={styles.containerButton}>
        {searching && (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
        </View>
        )}
        <TouchableOpacity onPress={handleButtonClick} style={styles.button} disabled={searching}>
          <Text style={styles.buttonText}>Começar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
        {searching && (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
        </View>
        )}
      <MapView
        style={styles.map}
        initialRegion={region}
        showsUserLocation={true}
        // loadingEnabled={true}
        onPress={(e) => newMarker(e)}
        customMapStyle={[{ MAPID }]}>
        {region && <Marker coordinate={region} />}
        {petShops.map((petShop) => (
          <Marker
            key={petShop.place_id}
            title={petShop.name}
            description={petShop.vicinity}
            image={petShopIcon}
            coordinate={{
              latitude: petShop.geometry.location.lat,
              longitude: petShop.geometry.location.lng,
            }}
          >
            <Callout
              onPress={() => {
                const ratingText = petShop.rating
                  ? `Avaliação: ${petShop.rating} estrelas`
                  : 'Avaliação não disponível';
                let openNow = '';
  
                if (petShop.hasOwnProperty('opening_hours')) {
                  const openingHours = petShop.opening_hours;
                  if (openingHours.open_now === true) {
                    openNow = 'Aberto agora!';
                  }else {
                    openNow = 'Fechado!';
                  }
                } 
  
                const info = `${petShop.name}\n${petShop.vicinity}\n${ratingText}\n${openNow}`;
  
                Alert.alert(
                  'Informações do pet shop',
                  info,
                  [
                    {
                      text: 'OK',
                      // onPress: () => console.log('OK Pressed', priceText),
                    },
                  ],
                  { textAlign: 'justify' }
                );
              }}
            >
            </Callout>
          </Marker>
          
        ))}
      </MapView>

      <TouchableOpacity style={styles.button} onPress={searchPetShop} disabled={searching}>
        <Text style={styles.buttonText}>Procurar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    containerButton: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    button: {
      marginTop: 16,
      backgroundColor: '#000',
      padding: 20,
      borderRadius: 8,
      marginBottom: 25
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
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
    map: {
        marginTop: '1%',
        marginBottom: '8%',
        height: width * 0.9,
        width: width,
    },
});
