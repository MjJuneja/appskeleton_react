import React, {Component} from "react";
import {StyleSheet, View, Text, Image, TextInput, TouchableOpacity, AsyncStorage, Linking} from 'react-native';
import SplashScreen from "../splashscreen";
import Toast, {DURATION} from 'react-native-easy-toast'
import axios from 'axios';
import md5 from 'md5';

class AboutScreen extends Component {
    constructor(props) {
        super(props);

        this._retrieveData();

        this.state = {
            userData: {},
            username: "",
            usernameValidationMsg: "",
            splashScreenActive: true
        };
    }

    _retrieveData = async () => {
        console.log("in retrieve data");
        try {
          const userData = await AsyncStorage.getItem('userData');
        //   const micFlag = await AsyncStorage.getItem('micFlag');
          if (userData !== null) {
            // We have data!!
            userData = JSON.parse(userData);
            console.log(userData);
            this.checkToken(userData.sessionId);
            this.setState({userData});
          } else {
              console.log("No data found");
          }
         } catch (error) {
           // Error retrieving data
           console.log(error);
         }
      }

      checkToken = token => {
        axios({
            method: 'post',
            url: 'http://13.238.16.112/answer/getAnswer',
            headers : {
                'Content-Type' : 'application/json',
                'Authorization' : 'token '+token
            },
            data: {
              "fromDate":"2018-08-19T00:00:00.000Z",
              "toDate":"2018-08-20T00:00:00.000Z"
            }
          }).then(data => {
              console.log(data.data);
              if(data.data.message=="Access denied") {
                this._removeData();
                this._handleNavigation('Home');
              } else {
                  console.log("access granted");
                  this.setState({splashScreenActive: false});
              }
          }).catch(err=>{
                console.log(err);
          });
      }
      
      _removeData = async()=> {
        console.log("removing data");
        try {
          const userData = await AsyncStorage.removeItem('userData');
         } catch (error) {
           // Error retrieving data
           console.log(error);
         }
      }

      _handleNavigation = (navigateTo)=> {
        console.log(navigateTo);
        const { navigate } = this.props.navigation;
        navigate(navigateTo);
    }

    render() {
        return(
            this.state.splashScreenActive ? <SplashScreen /> :
            <View style={loginStyle.container}>
                <Toast ref="toast"  position='top'/>
                <View style={loginStyle.formContainer}>
                    <Text style={{alignSelf: "center", color: "#333", marginBottom: 10, fontFamily: "Raleway-SemiBold", fontSize: 20}}>About Page</Text>
                    <Image
                        style={loginStyle.logo}
                        source={require ('../../assets/images/logo/logo.png')}
                    />
                    <Text style={{alignSelf: "center", fontFamily: "Roboto-Medium", fontSize: 16, marginBottom: 10}}>Watchyourtalk is a pioneer in the field of mobile personal development.</Text>
                    <Text style={{alignSelf: "center", fontFamily: "Roboto-Medium", fontSize: 16, marginBottom: 10}}>Founded in 2018, Watchyourtalk is on a mission to help people reduce stress, anxiety and general well-being.</Text>
                    <Text style={{alignSelf: "center", fontFamily: "Roboto-Medium", fontSize: 16, marginBottom: 10}}>Visit our website - www.watchyourtalk.com</Text> 
                    {/* <TouchableOpacity onPress={() => Linking.openURL('https://www.watchyourtalk.com')}><Text style={{alignSelf: "center", color: "blue", fontFamily: "Roboto-Medium", fontSize: 16, marginBottom: 10}}>www.watchyourtalk.com</Text></TouchableOpacity> */}

                </View>
            </View>
        )
    }
}

const loginStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f4f5f8"
    },
    logo : {
        height: 120,
        width: 100,
        alignSelf: "center",
        marginBottom: 20,
        marginTop: 20
    },
    headingText : {
        color: "#999",
        fontSize: 13,
        alignSelf: "center",
        marginBottom: 20
    },
    formContainer : {
        flex: 1,
        justifyContent: "center",
        padding: 20
    },
    loginHeading : {
        marginTop: 20,
        marginBottom: 20,
        fontSize: 25,
        alignSelf: "center",
        color: "#222"
    },
    input : {
        height: 40,
        borderColor: "#e1e1e1", 
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        color: "#333",
        backgroundColor: "#fff",
        fontFamily: "Roboto-Regular",
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
    }
});

export default AboutScreen;