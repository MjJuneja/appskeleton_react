import React, {Component} from "react";
import {StyleSheet, View, Text, Image, TextInput, TouchableOpacity, TouchableHighlight, AsyncStorage} from 'react-native';
import SplashScreen from "../splashscreen";
import Toast, {DURATION} from 'react-native-easy-toast'
import axios from 'axios';
import md5 from 'md5';

class Login extends Component {
    constructor(props) {
        super(props);
        this._retrieveData();

        this.state = {
            loginid: "",
            loginPassword: "",
            loginErrorMsg: "",
            loading: false,
            splashScreenActive: true
        };
    }

    _handleNavigation = (navigateTo)=> {
        console.log(this.props);
        const { navigate } = this.props.navigation;
        navigate(navigateTo);
    }

    // async componentWillMount() {
    //     await Expo.Font.loadAsync({
    //       "OpenSans-Light": require("../../assets/fonts/OpenSans-Light.ttf"),
    //       "OpenSans-Regular": require("../../assets/fonts/OpenSans-Regular.ttf"),
    //       "OpenSans-SemiBold": require("../../assets/fonts/OpenSans-SemiBold.ttf"),
    //       "Roboto-Light": require("../../assets/fonts/Roboto-Light.ttf"),
    //       "Roboto-Regular": require("../../assets/fonts/Roboto-Regular.ttf"),
    //       "Roboto-Medium": require("../../assets/fonts/Roboto-Medium.ttf"),
    //       "Raleway-Medium" : require("../../assets/fonts/Raleway-Medium.ttf"),
    //       "Raleway-Bold" : require("../../assets/fonts/Raleway-Bold.ttf"),
    //     });
    //     this.setState({loading: false});
    //   }

    _retrieveData = async () => {
        console.log("in retrieve data");
        try {
          const userData = await AsyncStorage.getItem('userData');
          if (userData !== null) {
            // We have data!!
            userData = JSON.parse(userData);
            console.log(userData);
            this._handleNavigation("MessageScreen");
          } else {
              console.log("No data found");

          }
          this.setState({splashScreenActive: false});
         } catch (error) {
           // Error retrieving data
           console.log(error);
         }
      }

    _storeData = async (userData) => {
        try {
          userData = JSON.stringify(userData);
          console.log(userData);
          await AsyncStorage.setItem('userData', userData);
          console.log("datastored");
        } catch (error) {
          // Error saving data
          console.log(error);
        }
      }

    loginHandle = ()=> {
        this.refs.toast.show("Verifying...", 500, () => {
            // something you want to do at close
        });
        axios({
            method: 'post',
            url: 'http://13.238.16.112/login/login',
            headers : {
                'Content-Type' : 'application/json'
            },
            data: {
                "loginid": this.state.loginid,
                "loginPassword": md5(this.state.loginPassword)
            }
          }).then(data => {
                console.log(data.data);
                if(data.data.message == "success") {
                    console.log("success");
                    this._storeData(data.data.userData);
                    this._handleNavigation("MessageScreen");
                }
                this.refs.toast.show(data.data.message, 1000, () => {
                    // something you want to do at close
                });

          }).catch(err=>{
                console.log(err);  
          });
    }

    render() {
        return(
            this.state.splashScreenActive ? <SplashScreen /> :
            this.state.loading ? <View><Text>Loading...</Text></View> :
            <View style={loginStyle.container}>
                <Toast ref="toast"  position='bottom'/>
                <Image
                    style={loginStyle.backgroundImage}
                    source={require ('../../assets/images/gradients/background1.jpg')}
                /> 
                <View style={loginStyle.formContainer}>
                
                    <Image
                        style={loginStyle.logo}
                        source={require ('../../assets/images/logo/logo.png')}
                    />
                    <Text style={loginStyle.loginHeading}>Watch Your Talk</Text>
                    <View>
                        <TextInput
                            placeholder = "Email"
                            style={loginStyle.input}
                            onChangeText={(loginid) => this.setState({loginid})}
                            value={this.state.loginid}
                            keyboardType = "email-address"
                            underlineColorAndroid='transparent'
                            placeholderTextColor="#b1b1b1" 
                        />
                        <TextInput
                            placeholder = "Password"
                            style={loginStyle.input}
                            onChangeText={(loginPassword) => this.setState({loginPassword})}
                            value={this.state.loginPassword}
                            secureTextEntry={true}
                            underlineColorAndroid='transparent'
                            placeholderTextColor="#b1b1b1" 
                        />
                        <Text>{this.state.loginErrorMsg}</Text>
                        <TouchableOpacity
                            style={loginStyle.loginButton}
                            onPress={this.loginHandle}
                        >
                            <Text style={loginStyle.loginButtonText}> Login </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={loginStyle.helpContainer}>
                        <View style={loginStyle.forgotPasswordContainer}>
                            <TouchableHighlight
                                onPress={this._handleNavigation.bind(this, "ForgotPassword")}
                            >
                                <Text style={loginStyle.forgotPasswordLink}>Forgot Password?</Text>
                            </TouchableHighlight>
                        </View>
                        <View style={loginStyle.registerContainer}>
                            <Text style={loginStyle.registerContainerText}>Don't have an account?</Text>
                            <TouchableHighlight
                                onPress={this._handleNavigation.bind(this, "RegisterOptions")}
                            >
                                <Text style={loginStyle.registerLink}>Register Here</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}

const loginStyle = StyleSheet.create({
    container: {
        flex: 1
    },
    logo : {
        height: 120,
        width: 100,
        alignSelf: "center"
    },
    formContainer : {
        flex: 1,
        justifyContent: "center",
        padding: 20
    },
    loginHeading : {
        marginTop: 0,
        marginBottom: 20,
        color: "#444",
        fontSize: 26,
        textAlign : "center",
        fontFamily: "OpenSans-SemiBold"
    },
    backgroundImage : {
        position: 'absolute',
        width: '100%',
        height: '120%',
        left: 0,
        top: 0,
        zIndex: -1
    },
    input : {
        height: 40,
        borderColor: "#e9e9e9", 
        borderWidth: 1,
        marginBottom: 10,
        padding: 10,
        borderRadius: 3,
        borderWidth: 1,
        borderColor: "#d1d1d1",
        backgroundColor: "rgba(0,0,0,0.6)",
        color: "#e9e9e9",
        fontFamily: "Roboto-Regular"
    },
    loginButton : {
        height: 40,
        backgroundColor: "#FF7417",
        alignSelf: "stretch",
        justifyContent: "center",
        borderRadius: 5
    },
    loginButtonText : {
        alignSelf: "center",
        color: "#fff",
        fontFamily: "OpenSans-SemiBold"
    },
    helpContainer : {
        flexDirection: "row",
        marginTop: 30
    },
    forgotPasswordContainer : {
        flex: 1
    },
    registerContainer : {
        flex: 1
    },
    forgotPasswordLink : {
        fontFamily : "Roboto-Medium",
        textDecorationLine: "underline",
        color: "#e1e1e1"
    },
    registerContainerText : {
        fontFamily: "Roboto-Medium",
        color: "#c1c1c1"
    },
    registerLink : {
        fontFamily : "Roboto-Medium",
        textDecorationLine: "underline",
        color: "#e1e1e1"
    }
});

export default Login;