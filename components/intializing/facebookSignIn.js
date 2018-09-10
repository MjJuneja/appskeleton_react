import React, {Component} from "react";
import {StyleSheet, View, Text, Image, AsyncStorage, TouchableOpacity} from 'react-native';
var { FBLogin, FBLoginManager } = require('react-native-facebook-login');

export default class FacebookSignIn extends Component {
    
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <FBLogin />
        )
    }
}