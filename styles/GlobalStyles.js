import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const inputsColor = '#fff';
const buttomColor = '#000';
const textButtom = '#fff';

export const bgImage = '../assets/bgImage.jpg';

export const globalStyles = StyleSheet.create({
  containerApp: {
    flex: 1,
  },
  containers: {
    flex: 1,
    marginTop: width * 0.2,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  input: {
    width: '100%',
    height: height * 0.08,
    borderRadius: 5,
    padding: width * 0.04,
    backgroundColor: inputsColor,
    marginBottom: width * 0.04,
  },
  buttom: {
    flexDirection: 'row',
    width: '50%',
    height: height * 0.08,
    borderRadius: 5,
    backgroundColor: buttomColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textButtom: {
    color: textButtom,
    paddingLeft: 10,
  },
  noCadastro: {
    color: 'white',
    marginTop: 10,
    // backgroundColor: 'black'
  },
  bgImage: {
    // flex: 1,
    width: '100%',
    height: '100%',
    // resizeMode: 'contain', 
  },
  viewInputs: {
    width: '70%',
    // alignItems: 'center',
  },
  title: {
    color: textButtom,
    fontSize: 20,
    marginBottom: '6%'
  },  
  titleInput: {
    color: textButtom,
    fontSize: 16
  },
  textDownButtom: {
    color: textButtom,
    fontSize: 16,
    marginTop: 10,
    fontWeight: 'bold',
    marginBottom: 100
  },
  sideBar: {
    flex: 1,
    marginTop: '30%',
    marginLeft: '5%'
  },
  buttonLogout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelLogout: {
    color: 'red',
    paddingLeft: 10,
  },
  erroMsg: {
    color: 'red',
    marginTop: -width * 0.04,
    marginBottom: width * 0.04,
    fontWeight: 'bold'
    // paddingBottom: width * 0.04
  }
});
