import { StyleSheet, Dimensions } from "react-native";
const windowWidth = Dimensions.get('window').width;

export const stylesPerfil = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: '#ffffff',
    },
    scrollViewContent: {
      paddingTop: windowWidth * 0.1,
      width: windowWidth,
    },
    selectImageIconContainer: {
      position: 'absolute',
      bottom: 10,
      right: 10,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      borderRadius: 20,
      padding: 5,
    },
    profileInfoContainer: {
      marginBottom: 20,
    },
    profileImageContainer: {
      width: 180,
      height: 180,
      borderRadius: 25,
      // borderBottomLeftRadius: 10,
      // borderBottomRightRadius: 10,
      overflow: 'hidden',
      marginBottom: 30,
      backgroundColor: '#f2f2f2'
    },
    profileImage: {
      width: '100%',
      height: '100%',
    },
    usernameText: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    emailText: {
      fontSize: 16,
    },
    editButton: {
      position: 'absolute',
      bottom: 10,
      right: 10,
      backgroundColor: 'blue',
      borderRadius: 50,
      padding: 10,
      elevation: 2,
    },
    editButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
  })