import React from 'react';
import { StyleSheet, Text, View,Image,Button } from 'react-native';
// import BG1 from './BG1.svg';
import {createStackNavigator} from 'react-navigation';
import Navigate from './Navigate';
import SplashScreen from './components/splashscreen';



export default class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      fontLoaded : true
    }
  }

  render() {
    if(this.state.fontLoaded == true) {
        return <Navigate />
    } else {
      return <SplashScreen />;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
