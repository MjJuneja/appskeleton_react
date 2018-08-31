import React, {Component} from "react";
import {StyleSheet, View, Text, Image, TextInput, TouchableOpacity, Linking} from 'react-native';

class RegisterOptions extends Component {

    constructor(props) {
        super(props);
    }

    call = ()=> {
        console.log(this.props);
        const { navigate } = this.props.navigation;
        navigate('EmailRegister');
    }

    render() {
        return(
            <View style={registerOptionsStyles.container}>

                <Image
                    style={registerOptionsStyles.backgroundImage}
                    source={require ('../../assets/images/gradients/background1.jpg')}
                />            

                <Image
                    style={registerOptionsStyles.logo}
                    source={require ('../../assets/images/logo/logo.png')}
                />

                <View style={registerOptionsStyles.optionsContainer}>

                    <TouchableOpacity
                        style={registerOptionsStyles.registerOptionFacebook}
                        onPress={this.loginHandle}
                    >
                        <Text style={registerOptionsStyles.registerOptionFacebookText}>Facebook</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={registerOptionsStyles.registerOptionGoogle}
                        onPress={this.loginHandle}
                    >
                        <Text style={registerOptionsStyles.registerOptionGoogleText}>Google</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={registerOptionsStyles.registerOptionEmail}
                        onPress={this.call}
                    >
                        <Text style={registerOptionsStyles.registerOptionEmailText}>E-Mail</Text>
                    </TouchableOpacity>

                </View>
            </View>
        );
    }

}

const registerOptionsStyles = StyleSheet.create({
    container : {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "transparent"
    },
    headingText : {
        color: "#222",
        fontSize: 20,
        padding: 15,
        backgroundColor: "#fff",
        borderBottomWidth : 1,
        borderColor: "#e1e1e1",
        // fontFamily: "OpenSans-SemiBold",
        position: "absolute",
        top: 0,
        width: "100%"
    },
    headingTextLight : {
        // fontFamily: "OpenSans-Regular"
    },
    headingTextBold : {
        // fontFamily: "OpenSans-SemiBold"
    },
    backgroundImage : {
        position: 'absolute',
        width: '100%',
        height: '120%',
        left: 0,
        top: 0,
        zIndex: -1
    },
    logo : {
        height: 120,
        width: 100,
        alignSelf: "center",
        marginTop: 60
    },
    optionsContainer : {

    },
    registerOptionFacebook : {
        marginTop: 30,
        paddingTop: 17,
        paddingBottom: 17,
        paddingLeft: 30,
        paddingRight: 30,
        alignSelf: "center",
        backgroundColor: "#3B5998",
        width: "80%",
        borderRadius: 3
    },
    registerOptionGoogle : {
        marginTop: 30,
        paddingTop: 17,
        paddingBottom: 17,
        paddingLeft: 30,
        paddingRight: 30,
        alignSelf: "center",
        backgroundColor: "#DB4437",
        width: "80%",
        borderRadius: 3
    },
    registerOptionEmail : {
        marginTop: 30,
        paddingTop: 17,
        paddingBottom: 17,
        paddingLeft: 30,
        paddingRight: 30,
        alignSelf: "center",
        backgroundColor: "transparent",
        width: "80%",
        borderRadius: 3,
        borderWidth: 1,
        borderColor: "#d1d1d1",
        backgroundColor: "rgba(255,255,255,0.15)"
    },
    registerOptionFacebookText : {
        color : "#fff",
        fontFamily : "Roboto-Medium",
        textAlign: "center"
    },
    registerOptionGoogleText : {
        color : "#fff",
        fontFamily : "Roboto-Medium",
        textAlign: "center"
    },
    registerOptionEmailText : {
        color : "#d1d1d1",
        fontFamily : "Roboto-Medium",
        textAlign: "center"
    }
});

export default RegisterOptions;