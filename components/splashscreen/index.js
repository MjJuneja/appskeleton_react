import React, { Component } from "react";
import {StyleSheet, View, Text, Image} from 'react-native';

class SplashScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            displaySplashScreen: true
        }
    }

    componentDidMount() {
        
    }

    render() {
        if(this.state.displaySplashScreen===true) {
            return (
                <View style={splashScreenStyle.container}>
                    <View style={splashScreenStyle.logoContainer}>
                        <Image
                            style={splashScreenStyle.logo}
                            source={require ('../../assets/images/logo/LogoWatchYourTalk.jpg')}
                        />
                    </View>
                </View>
            );
        } else {
            return (<View></View>);
        }
    }
}

const splashScreenStyle = StyleSheet.create({
    container : {
        flex : 1,
        backgroundColor: "#fff"
    },
    logoContainer: {
        flex : 1,
        justifyContent: 'center',
        alignSelf : 'center'
    },
    logo : {
        width: 100, 
        height: 120
    }
});

export default SplashScreen;