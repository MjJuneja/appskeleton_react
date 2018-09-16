import React, {Component} from "react";
import {StyleSheet, View, Text, Image, TextInput, TouchableOpacity, AsyncStorage} from 'react-native';
import SplashScreen from "../splashscreen";
import Toast, {DURATION} from 'react-native-easy-toast'
import axios from 'axios';
import md5 from 'md5';

class ChangeUsername extends Component {
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
          if (userData !== null) {
            // We have data!!
            userData = JSON.parse(userData);
            console.log(userData);
            this.checkToken(userData.sessionId);
            this.setState({
                userData,
                username: userData.username
            });
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

    validateUsername = username => {
        var re = /^([a-zA-Z0-9_.]{5,20})$/;
        return re.test(username);
    }
    usernameValidation = username => {
        if(this.validateUsername(username)) {
            this.setState({usernameValidationMsg : ""});
        } else {
            this.setState({usernameValidationMsg: "Invalid username(Should have only a-z,0-9,.,_ and 5-20 chars,without any spaces)"});
        }
    }

    loginHandle = ()=> {
        axios({
            method: 'post',
            url: 'http://13.238.16.112/profile/changeUsername',
            headers : {
                'Content-Type' : 'application/json',
                'Authorization' : 'token '+this.state.userData.sessionId
            },
            data: {
                "username": this.state.username
            }
          }).then(data => {
              console.log(data.data);
              this.refs.toast.show(data.data.message, 1000, () => {
                // something you want to do at close
            });
          }).catch(err=>{
                console.log(err);  
          });
    }

    render() {
        return(
            this.state.splashScreenActive ? <SplashScreen/> :
            <View style={loginStyle.container}>
                <Toast ref="toast"  position='top'/>
                <View style={loginStyle.formContainer}>
                <Text style={loginStyle.headingText}>ENTER THE NEW USERNAME</Text>
                    <View>

                        <View>
                            {/* <Text>New Username: </Text> */}
                            <TextInput
                                placeholder = "New Username"
                                style={loginStyle.input}
                                onChangeText={(username) => {this.setState({username}); this.usernameValidation(username)}}
                                value={this.state.username}
                                underlineColorAndroid='transparent'
                            />
                            <Text>{this.state.usernameValidationMsg}</Text>
                        </View>

                        <TouchableOpacity
                            style={loginStyle.loginButton}
                            onPress={this.loginHandle}
                        >
                            <Text style={loginStyle.loginButtonText}> Update Username  </Text>
                        </TouchableOpacity>
                    </View>
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
        alignSelf: "center"
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
        backgroundColor: "rgb(255,68,34)",
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

export default ChangeUsername;