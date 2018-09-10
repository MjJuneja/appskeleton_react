import React, {Component} from "react";
import {StyleSheet, View, Text, Image, TextInput, TouchableOpacity, AsyncStorage} from 'react-native';
import SplashScreen from "../splashscreen";
import Toast, {DURATION} from 'react-native-easy-toast'
import axios from 'axios';
import md5 from 'md5';

class ChangePassword extends Component {
    constructor(props) {
        super(props);

        this._retrieveData();

        this.state = {
            userData: {},
            email: "",
            password: "",
            confirmPassword: "",
            newPassword: "",
            confirmNewPassowrd: "",
            currentPasswordValidationMsg : "",
            passwordValidationMsg: "",
            confirmPasswordValidationMsg : "",
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
                userData
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

    currentPasswordValidation = (currentPassword)=> {
        let currentPasswordValidationMsg = "";
        if(currentPassword == "") {
            currentPasswordValidationMsg = "Current Password cannot be empty";
        }
        this.setState({currentPasswordValidationMsg})
        return currentPasswordValidationMsg;
    }

    validatePassword = password => {
        var re = /^[a-z0-9A-Z!@#$%^&*()_.]{8,25}$/;
        return re.test(password);
    }
    passwordValidation = (password)=> {
        let passwordValidationMsg = "";
        if(this.validatePassword(password)) {
            this.setState({passwordValidationMsg: ""});
        } else {
            passwordValidationMsg = "Password too small or invalid character,use(8-25 char)(a-z,0-9,A-Z,!,@,#,$,%,^,&,*,(,),_,.)";
            this.setState({passwordValidationMsg});
        }
        return passwordValidationMsg;
    }

    confirmPasswordValidation = (confirmPassword)=> {
        let confirmPasswordValidationMsg;
        if(confirmPassword != "") {
            if(confirmPassword !== this.state.newPassword) {
                confirmPasswordValidationMsg = "Password did not match";
                this.setState({confirmPasswordValidationMsg});
            } else {
                this.setState({confirmPasswordValidationMsg: ""});
            }
        } else {
            confirmPasswordValidationMsg = "Confirm password cannot be empty";
            this.setState({confirmPasswordValidationMsg});
        }
        return confirmPasswordValidationMsg;
    }

    loginHandle = ()=> {

        let passwordValidationMsg = this.passwordValidation(this.state.newPassword);
        let confirmPasswordValidationMsg = this.confirmPasswordValidation(this.state.confirmNewPassowrd);
        let currentPasswordValidationMsg = this.currentPasswordValidation(this.state.password);

        if(
            passwordValidationMsg == "" &&
            confirmPasswordValidationMsg == "" &&
            currentPasswordValidationMsg == ""
        ) {
        axios({
            method: 'post',
            url: 'http://13.238.16.112/profile/setNewPassword',
            headers : {
                'Content-Type' : 'application/json',
                'Authorization' : 'token '+this.state.userData.sessionId
            },
            data: {
                "oldPassword": md5(this.state.password),
                "password" : md5(this.state.newPassword)
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
    }

    render() {
        return(
            this.state.splashScreenActive ? <SplashScreen /> :
            <View style={loginStyle.container}>
                <Toast ref="toast"  position='top'/>
                <View style={loginStyle.formContainer}>
                    <View>
                        <View style={{marginBottom: 15}}>
                            {/* <Text>Current Password: </Text> */}
                            <TextInput
                                placeholder = "Current Password"
                                style={loginStyle.input}
                                onChangeText={(password) => {this.setState({password}); this.currentPasswordValidation(password);}}
                                value={this.state.password}
                                secureTextEntry ={true}
                            />
                            <Text style={loginStyle.errorMsg}>{this.state.currentPasswordValidationMsg}</Text>
                        </View>

                        <View style={{marginBottom: 10}}>
                            {/* <Text>New Password: </Text> */}
                            <TextInput
                                placeholder = "New Password"
                                style={loginStyle.input}
                                onChangeText={(newPassword) => {this.setState({newPassword}); this.passwordValidation(newPassword)}}
                                value={this.state.newPassword}
                                secureTextEntry ={true}
                            />
                            <Text style={loginStyle.errorMsg}>{this.state.passwordValidationMsg}</Text>
                        </View>
                        <View style={{marginBottom: 10}}>
                            {/* <Text>Confrim New Password: </Text> */}
                            <TextInput
                                placeholder = "Confirm New Password"
                                style={loginStyle.input}
                                onChangeText={(confirmNewPassowrd) => {this.setState({confirmNewPassowrd}); this.confirmPasswordValidation(confirmNewPassowrd)}}
                                value={this.state.confirmNewPassowrd}
                                secureTextEntry ={true}
                            />
                            <Text style={loginStyle.errorMsg}>{this.state.confirmPasswordValidationMsg}</Text>
                        </View>

                        <TouchableOpacity
                            style={loginStyle.loginButton}
                            onPress={this.loginHandle}
                        >
                            <Text style={loginStyle.loginButtonText}> Update Password  </Text>
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
    },
    errorMsg :{
        color: "red"
    }
});

export default ChangePassword;