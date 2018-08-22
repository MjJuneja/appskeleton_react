import React from 'react';
import { StyleSheet, Text, View,Image,Button } from 'react-native';
import BG1 from './BG1.svg';
import {createStackNavigator} from 'react-navigation';
import Navigate from './Navigate';

export default class App extends React.Component {
  render() {
    return <Navigate />;
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
