import { StyleSheet, Dimensions } from 'react-native';

const inputsColor = '#f2f2f2';
const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
  flatList: {
    flexGrow: 0,
    width: '100%',
    height: '80%',
    maxHeight: '100%',
  },
  buttonAdd: {
    marginTop: 16,
    backgroundColor: '#000',
    padding: 20,
    borderRadius: 8,
    marginBottom: 25
  },
  buttonClose: {
    marginTop: 16,
    backgroundColor: 'red',
    padding: 20,
    borderRadius: 8,
    marginBottom: 25,
    marginLeft: 25
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  viewInput: {
    width: '70%'
  },
  input: {
    width: '100%',
    height: height * 0.08,
    borderRadius: 5,
    padding: width * 0.04,
    backgroundColor: inputsColor,
    marginBottom: width * 0.04,
  },
  modalBlur: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modal: {
    position: 'absolute',
    width: width * 0.8,
    // height: '50%',
    maxHeight: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.25,
    // shadowRadius: 4,
    elevation: 8,
  },
  modalHeader: {
    alignItems: 'center',
    marginTop: '6%',
    marginBottom: '10%',
  },
  modalHeaderText: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  titleInputModal: {
    marginBottom: 10,
    fontSize: 16
  },
  viewButtons: {
    flexDirection: 'row',
  },
  cardPets: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 5,
    // padding: 10,
    paddingRight: 25,
    paddingLeft: 10,
    marginVertical: 10,
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
  textFlatList: {
    // backgroundColor: 'red',
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: width * 0.35,
  }
});
