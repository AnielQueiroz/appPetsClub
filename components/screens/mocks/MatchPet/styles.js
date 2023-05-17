import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
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
    height: '64%',
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
