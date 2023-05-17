import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get('window');

const inputsColor = '#f2f2f2';
const textButtom = '#000';

export const stylesEditPerfil = StyleSheet.create({
    editProfileContainer: {
        flex: 1,
        width: '100%',
        // alignItems: 'center',
        padding: 20,
    },
    viewInputs: {
        marginTop: '10%',
        marginBottom: '10%',
        width: '70%',
    },
    titleInput: {
        color: textButtom,
        fontSize: 16
    },
    input: {
        width: '100%',
        height: height * 0.08,
        borderRadius: 5,
        padding: width * 0.04,
        backgroundColor: inputsColor,
        marginBottom: width * 0.04,
    },
    buttonsContainer: {
        flexDirection: 'row',
        width: 200,
        justifyContent: 'space-evenly',
        marginBottom: '10%'
    },
    buttonText: {
        color: '#fff'
    },
    saveButton: {
        backgroundColor: 'green',
        borderRadius: 10,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
      cancelButton: {
        backgroundColor: 'red',
        borderRadius: 10,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
})