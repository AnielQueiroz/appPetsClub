import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const drawerNavigatorBg = '#3d91b7';
export const activeDrawer = '#000';
export const drawerScreenOptions = {
    drawerActiveBackgroundColor: activeDrawer,
    headerStyle: {
        backgroundColor: drawerNavigatorBg,
    },
    headerTintColor: '#fff'   
}

export const stylesScreens = StyleSheet.create({

})