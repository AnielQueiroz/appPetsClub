import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function HomeInside({ navigation }) {
    const [buttons, setButtons] = useState([
        {
            title: 'Meus pets',
            description: 'Meus pets', 
            onPress: () => navigation.navigate('MyPets'),
        },
        {
            title: 'Histórico',
            description: 'Meus históricos', 
            onPress: () => Alert.alert('Aviso', 'Pressed'),
        },
    ]);

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.card} onPress={item.onPress}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardText}>{item.description}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList 
                data={buttons}
                renderItem={renderItem}
                keyExtractor={(item) => item.title}
                numColumns={2}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // flexDirection: 'row',
        justifyContent: 'center', // Alinha horizontalmente ao centro
        // alignItems: 'center', // Alinha verticalmente ao centro
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        margin: '5%',
        shadowColor: '#000',
        height: 150,
        width: width * 0.4, // Definindo a largura dos cards como 40% da largura da tela
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    cardText: {
        fontSize: 16,
        marginBottom: 8,
    },
});
