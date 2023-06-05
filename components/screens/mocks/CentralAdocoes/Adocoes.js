import React, { useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, StyleSheet, Dimensions } from 'react-native';

import { DatabaseConnection } from '../../../../src/database/database-connection';
import { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');
const db = DatabaseConnection.getConnection();

export default function Adocoes() {
  const [pets, setPets] = useState([]);

  const loadPets = () => {
    // console.log('Load Pets => ', userid)
    db.transaction(function (txn) {
        txn.executeSql(
          'SELECT p.*, u.user_name as ownerName FROM table_pets p JOIN table_users u ON p.user_id = \'1\' WHERE p.is_donating = \'0\''
          ,
            [],
            function (tx, res) {
                var petsTemp = [];
                
                for (let i = 0; i < res.rows.length; i++) {
                    var pet = res.rows.item(i);
                    petsTemp.push(pet);
                    setPets(petsTemp);
                }
                
                setPets(petsTemp);

                console.log('PETS => ', pets);
            }
            )
        })
  };

  const renderItem = ({ item, index }) => {  
    return (
      <TouchableOpacity>
        <View style={styles.cardPets}>
          <View style={styles.viewPhoto}>
            <Image style={styles.photoPet} source={{ uri: item.photo }} />
          </View>

          <Text style={styles.textFlatTitle}>Nome do dono:</Text>
          <Text style={styles.textFlatSubTitle}>{item.ownerName}</Text>
          <Text style={styles.textFlatTitle}>Nome do pet:</Text>
          <Text style={styles.textFlatSubTitle}>{item.pet_name}</Text>
          <Text style={styles.textFlatTitle}>Raça:</Text>
          <Text style={styles.textFlatList}>{item.pet_race}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  useFocusEffect(
    useCallback(() => {
      loadPets();
    }, [])
  );


  return (
    <View>
        <FlatList
          data={pets}
          renderItem={renderItem}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
  flatList: {
    // flexGrow: 0,
    width: '100%',
    height: '80%',
    maxHeight: '100%',
  },
  cardPets: {
    // flexDirection: 'row',
    // alignItems: 'center',
    // justifyContent: 'space-evenly',
    backgroundColor: '#b8d6e3',
    height: '72%',
    // height: 400,
    width: width * 0.7,
    borderRadius: 5,
    paddingRight: 10,
    paddingLeft: 10,
    marginVertical: width * 0.2,
    marginHorizontal: 20,
    shadowColor: 'red',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4
  },
  textFlatTitle: {
    paddingTop: 10,
    color: 'gray'
  },
  textFlatSubTitle: {
    paddingBottom: 10,
    fontSize: 24
  },
  textFlatList: {
    paddingBottom: 10,
    fontSize: 18
  },
  viewPhoto: {
    marginVertical: 25,
    alignSelf: 'center',    
    width: '100%',
    height: width * 0.5,
  },
  photoPet: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
  containerPetDetails: {
    flex: 1,
    padding: 24,
  },
  viewImgPetDetails: {
    alignItems: 'center',
    marginBottom: 24,
  },
  imagePetDetails: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  detailsContainer: {
    marginBottom: 16,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    marginBottom: 8,
  },
  icon: {
    marginRight: 8,
  },
  twitterContainer: {
    flexDirection: 'row'
  },
  eyeIcon: {
    marginTop: 10
  }
});
