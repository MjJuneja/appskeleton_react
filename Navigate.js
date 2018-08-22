import {createStackNavigator} from 'react-navigation';
import React from 'react';
import { StyleSheet, Text, View,Image,Button } from 'react-native';
import HomeScreen from './Home';
import Expo from 'expo';



class ProfileScreen extends React.Component {
  static navigationOptions = {
    title: 'Welcome',
  };
  render() {
    const { navigate } = this.props.navigation;
    return(<Text></Text>);
  }
}

let MyTransition = (index, position) => {
    const inputRange = [index - 1, index, index + 1];
    const opacity = position.interpolate({
        inputRange,
        outputRange: [.8, 1, 1],
    });

    const scaleY = position.interpolate({
        inputRange,
        outputRange: ([0.8, 1, 10]),
    });

    return {
        opacity,
        transform: [
            {scaleY}
        ]
    };
};

let TransitionConfiguration = () => {
    return {
        // Define scene interpolation, eq. custom transition
        screenInterpolator: (sceneProps) => {

            const {position, scene} = sceneProps;
            const {index} = scene;

            return MyTransition(index, position);
        }
    }
};


const Navigate = createStackNavigator({
  Home: { screen: HomeScreen },
  Profile: { screen: ProfileScreen },
    },{
        // navigationOptions:{
        //     headerStyle:{
        //         marginTop:Expo.Constants.statusBarHeight
        //     }
        // }
        transitionConfig: TransitionConfiguration
    }
);

export default Navigate;