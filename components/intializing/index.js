import React, {Component} from "react";
import {StyleSheet, View, Text, Image, TextInput, AsyncStorage, TouchableOpacity, Linking} from 'react-native';
import { Icon } from 'react-native-elements'

class LinkToRegister extends Component {

    constructor(props){
        super(props);

        this._retrieveData();
        
        this.state = {
            username:'',
            message:'',
            loading: false
        };
      }

      _retrieveData = async () => {
        console.log("in retrieve data");
        try {
          const justInstalled = await AsyncStorage.getItem('justInstalled');
          console.log(justInstalled);
          if (justInstalled !== null) {
            this._handleNavigation("Login");
          } else {
            //   this._storeData(false);
          }
         } catch (error) {
           console.log(error);
         }
      }

    //   _storeData = async (userData) => {
    //     try {
    //       userData = JSON.stringify(userData);
    //       console.log(userData);
    //       await AsyncStorage.setItem('justInstalled', userData);
    //       console.log("datastored");
    //     } catch (error) {
    //       // Error saving data
    //       console.log(error);
    //     }
    //   }

    //   async componentWillMount() {
    //     await Expo.Font.loadAsync({
    //       "OpenSans-Light": require("../../assets/fonts/OpenSans-Light.ttf"),
    //       "OpenSans-Regular": require("../../assets/fonts/OpenSans-Regular.ttf"),
    //       "OpenSans-SemiBold": require("../../assets/fonts/OpenSans-SemiBold.ttf"),
    //       "Roboto-Light": require("../../assets/fonts/Roboto-Light.ttf"),
    //       "Roboto-Regular": require("../../assets/fonts/Roboto-Regular.ttf"),
    //       "Roboto-Medium": require("../../assets/fonts/Roboto-Medium.ttf"),
    //       "Raleway-Medium" : require("../../assets/fonts/Raleway-Medium.ttf"),
    //     });
    //     this.setState({loading: false});
    //   }



    _handleNavigation = (navigateTo)=> {
        console.log(this.props);
        const { navigate } = this.props.navigation;
        navigate(navigateTo);
    }

    render() {
        return(
            this.state.loading ? <View><Text>Loading</Text></View> : 
            <View style={linkToRegisterStyles.container}>
                <Image
                    style={linkToRegisterStyles.backgroundImage}
                    source={require ('../../assets/images/gradients/background1.jpg')}
                />
                <Image
                    style={linkToRegisterStyles.logo}
                    source={require ('../../assets/images/logo/logo.png')}
                />
                <Text style={linkToRegisterStyles.headingText}>
                    <Text style={linkToRegisterStyles.headingTextLight}>Welcome to </Text><Text style={linkToRegisterStyles.headingTextBold}>Watch Your Talk</Text>
                    {/* <Text style={linkToRegisterStyles.headingTextLight}> to {"\n"}</Text>
                    <Text style={linkToRegisterStyles.headingTextBold}>Watch Your Talk</Text> */}
                </Text>

                <Text style={{position:"absolute", color: "#b1b1b1", bottom: 90, width: "75%", padding: 10, textAlign: "center", fontSize: 15, fontFamily:"OpenSans-SemiBold"}}>
                    Watch Your Talk is ... Some description about the app will come here. A very breif descripton of the app.
                </Text>

                

                <TouchableOpacity
                    style={linkToRegisterStyles.registerButton}
                    onPress={this._handleNavigation.bind(this, "RegisterOptions")}
                >
                    <Text style={linkToRegisterStyles.registerText}>Register </Text>
                    <Icon size={20} style={linkToRegisterStyles.registerIcon} color="#c1c1c1" name={"keyboard-arrow-right"} />
                </TouchableOpacity>
            </View>
        );
    }

}

const linkToRegisterStyles = StyleSheet.create({
    container : {
        flex: 1,
        alignItems: 'center',
        backgroundColor: "transparent",
        paddingTop: 20
    },
    headingText : {
        color: "#222",
        textAlign: "center"
    },
    backgroundImage : {
        position: 'absolute',
        width: '100%',
        height: '120%',
        left: 0,
        top: 0,
        zIndex: -1
    },
    headingTextLight : {
        // fontFamily: "OpenSans-Regular",
        color: "#555",
        fontSize: 26,
        // textShadowColor: 'rgba(0, 0, 0, 0.75)',
        // textShadowOffset: {width: -1, height: 1},
        // textShadowRadius: 10,
        fontFamily: "Roboto-Regular"
    },
    headingTextBold : {
        color: "#444",
        fontSize: 26,
        fontFamily: "OpenSans-SemiBold"
    }, 
    logo : {
        height: 120,
        width: 100,
        alignSelf: "center",
        marginTop: 60,
        marginBottom: 15
    },
    registerButton : {
        marginTop: 30,
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 30,
        paddingRight: 30,
        borderTopWidth : 1,
        borderColor: "rgba(255,255,255,0.3)",
        position: "absolute",
        bottom: 0,
        width: "100%",
        display: "flex",
        flexDirection : "row",
        backgroundColor: "rgba(255,255,255,0.15)"
    },
    registerText : {
        color : "#c1c1c1",
        fontFamily : "Roboto-Medium",
        flex: 1,

    },
    registerIcon : {
        flex: 1,
        backgroundColor: "transparent"
    }
});

export default LinkToRegister;