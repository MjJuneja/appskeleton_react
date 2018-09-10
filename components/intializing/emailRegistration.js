import React, {Component} from "react";
import {StyleSheet, View, Text, Button, ScrollView, TextInput, TouchableOpacity, TouchableHighlight, Linking, AsyncStorage} from 'react-native';
import axios from 'axios';
import md5 from 'md5';
import Toast, {DURATION} from 'react-native-easy-toast'
import {CheckBox} from 'react-native-elements';

class EmailRegister extends Component {
    constructor(props) {
        super(props);

        this.state = {
            "userEmail":"",
            "username":"",
            "password":"",
            "confirmPassword" : "",
            "firstName":"",
            "lastName":"",
            "code":"+61",
            "mobile":"",
            "role":"customer",
            "emailValidationMsg" : "",
            "usernameValidationMsg" : "",
            "firstNameValidationMsg" : "",
            "lastNameValidationMsg" : "",
            "passwordValidationMsg" : "",
            "confirmPasswordValidationMsg" : "",
            "mobileValidationMsg" : "",
            "loading" : false,
            "checked" : false,
            "termErrorMsg": ""
        };
    }

   

    validateEmail = email => {
        var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
        return re.test(email);
    }
    emailValidation = email => {
        let emailValidationMsg = "";
        if(this.validateEmail(email)) {
            this.setState({emailValidationMsg : ""});
        } else {
            emailValidationMsg = "Enter a valid email address";
            this.setState({emailValidationMsg});
        }
        return emailValidationMsg;
    }


    validateUsername = username => {
        var re = /^([a-zA-Z0-9_.]{5,20})$/;
        return re.test(username);
    }
    usernameValidation = username => {
        let usernameValidationMsg = "";
        if(this.validateUsername(username)) {
            this.setState({usernameValidationMsg : ""});
        } else {
            usernameValidationMsg = "Invalid username(Should have only a-z,0-9,.,_ and 5-20 chars,without any spaces)";
            this.setState({usernameValidationMsg});
        }
        return usernameValidationMsg;
    }

    nameValidation = (name, position) => {
        let firstNameValidationMsg = "";
        let lastNameValidationMsg = "";
        if(name == "") {
            if(position == 1) {
                firstNameValidationMsg = "First Name cannot be empty"
                this.setState({firstNameValidationMsg});
                return firstNameValidationMsg;
            } else {
                lastNameValidationMsg = "Last Name cannot be empty"
                this.setState({lastNameValidationMsg: "Last Name cannot be empty"});
                return lastNameValidationMsg;
            }
        } else {
            if (position == 1) {
                this.setState({firstNameValidationMsg: ""});
                return firstNameValidationMsg;
            } else {
                this.setState({lastNameValidationMsg: ""});
                return lastNameValidationMsg;
            }
        }
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
        let confirmPasswordValidationMsg = "";
        console.log("cf" , confirmPassword);
        if(confirmPassword != "") {
            if(confirmPassword !== this.state.password) {
                confirmPasswordValidationMsg = "Password did not match";
                this.setState({confirmPasswordValidationMsg});
            } else {
                this.setState({confirmPasswordValidationMsg: ""});
            }
        } else {
            confirmPasswordValidationMsg = "Confirm Password cannot be empty";
            this.setState({confirmPasswordValidationMsg});
        }
        return confirmPasswordValidationMsg;
    }

    validateMobile = mobile => {
        var re = /^[0-9]{10}$/;
        return re.test(mobile);
    }
    mobileValidation = mobile => {
        let mobileValidationMsg = "";
        if(this.validateMobile(mobile)) {
            this.setState({mobileValidationMsg: ""});
        } else {
            mobileValidationMsg = "Invalid Mobile Number";
            this.setState({mobileValidationMsg})
        }
        return mobileValidationMsg;
    }

    loginHandle = ()=> {
        alert("Register button pressed");
    }

    test = ()=> {
        console.log("in test function");
        console.log(this.state);

            let emailValidationMsg = this.emailValidation(this.state.userEmail);
            let passwordValidationMsg = this.passwordValidation(this.state.password);
            let usernameValidationMsg = this.usernameValidation(this.state.username);
            let firstNameValidationMsg = this.nameValidation(this.state.firstName, 1);
            let lastNameValidationMsg = this.nameValidation(this.state.lastName, 2);
            let mobileValidationMsg = this.mobileValidation(this.state.mobile);
            let confirmPasswordValidationMsg = this.confirmPasswordValidation(this.state.confirmPassword);
            let termErrorMsg = "";

            if(!this.state.checked) {
                termErrorMsg = "Please read and agree terms";
                this.setState({termErrorMsg});
            }

            console.log(termErrorMsg);

            if(
                emailValidationMsg =="" &&
                passwordValidationMsg=="" &&
                firstNameValidationMsg =="" &&
                lastNameValidationMsg == "" &&
                mobileValidationMsg == "" &&
                usernameValidationMsg == "" &&
                confirmPasswordValidationMsg == "" &&
                termErrorMsg == ""
            ) {

                this.refs.toast.show("Creatin New Account...", 1000, () => {
                    // something you want to do at close
                });

        axios({
            method: 'post',
            url: 'http://13.238.16.112/signup/registerUser',
            headers : {
                'Content-Type' : 'application/json'
            },
            data: {
                "userEmail": this.state.userEmail,
                "username": this.state.username,
                "password": md5(this.state.password),
                "firstName": this.state.firstName,
                "lastName": this.state.lastName,
                "code": this.state.code,
                "phone": this.state.mobile,
                "role": this.state.role
            }
          }).then(data => {
              console.log(data.data);
              let msg = "";
              if(data.data.message == "success") {
                  msg = "Account created successfully.";
                  this._storeData(data.data.userData);
                  this.refs.toast.show(msg, 1000, () => {
                    // something you want to do at close
                });
                  this._handleNavigation('MessageScreen');
                  
              } else if(data.data.message == "email already taken") {
                  this.setState({emailValidationMsg: "Email already taken"});
              } else if (data.data.message == "username already taken") {
                  this.setState({usernameValidationMsg: "Username already taken"});
              }
              
          }).catch(err=>{
                console.log(err);  
          });
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
    
    _handleNavigation = (navigateTo)=> {
        console.log(this.props);
        const { navigate } = this.props.navigation;
        navigate(navigateTo);
    }

    tickHandle = ()=> {
        if(!this.state.checked) 
            this.setState({checked: true, termErrorMsg: ""});
        else
            this.setState({checked: false});
    }

    render() {
        return(
            this.state.loading ? <View><Text>Loading...</Text></View> :
            <View style={registerStyle.container}>
            <ScrollView>
                <Toast ref="toast"  position='bottom'/>
                <View style={registerStyle.formContainer}>
                    <Text style={registerStyle.loginHeading}>Create an account on Watch Your Talk</Text>
                    <Text style={registerStyle.loginSubHeading}>This is a general well-being app</Text>
                    <View>
                        <View style={registerStyle.inputWrapper}>
                            <TextInput
                                placeholder = "Email"
                                style={registerStyle.input}
                                onChangeText={(userEmail) => {this.setState({userEmail}); this.emailValidation(userEmail);}}
                                value={this.state.userEmail}
                                keyboardType = "email-address"
                                underlineColorAndroid='transparent'
                            />
                            <Text style={registerStyle.errorMsg}>{this.state.emailValidationMsg}</Text>
                        </View>
                        <View style={registerStyle.inputWrapper}>
                            <TextInput
                                placeholder = "Username"
                                style={registerStyle.input}
                                onChangeText={(username) => {this.setState({username}); this.usernameValidation(username)}}
                                value={this.state.username}
                                underlineColorAndroid='transparent'
                            />
                            <Text style={registerStyle.errorMsg}>{this.state.usernameValidationMsg}</Text>
                        </View>
                        <View style={registerStyle.inputWrapper}>
                            <TextInput
                                placeholder = "First Name"
                                style={registerStyle.input}
                                onChangeText={(firstName) => {this.setState({firstName}); this.nameValidation(firstName, 1);}}
                                value={this.state.firstName}
                                underlineColorAndroid='transparent'
                            />
                            <Text style={registerStyle.errorMsg}>{this.state.firstNameValidationMsg}</Text>
                        </View>
                        <View style={registerStyle.inputWrapper}>
                            <TextInput
                                placeholder = "Last Name"
                                style={registerStyle.input}
                                onChangeText={(lastName) => {this.setState({lastName}); this.nameValidation(lastName, 2);}}
                                value={this.state.lastName}
                                underlineColorAndroid='transparent'
                            />
                            <Text style={registerStyle.errorMsg}>{this.state.lastNameValidationMsg}</Text>
                        </View>
                        <View style={registerStyle.inputWrapper}>
                            <TextInput
                                placeholder = "Password"
                                style={registerStyle.input}
                                onChangeText={(password) => {this.setState({password}); this.passwordValidation(password);}}
                                value={this.state.password}
                                underlineColorAndroid='transparent'
                                secureTextEntry={true}
                            />
                            <Text style={registerStyle.errorMsg}>{this.state.passwordValidationMsg}</Text>
                        </View>
                        <View style={registerStyle.inputWrapper}>
                            <TextInput
                                placeholder = "Confirm Password"
                                style={registerStyle.input}
                                onChangeText={(confirmPassword) => {this.setState({confirmPassword}); this.confirmPasswordValidation(confirmPassword);}}
                                value={this.state.confirmPassword}
                                underlineColorAndroid='transparent'
                                secureTextEntry={true}
                            />
                            <Text style={registerStyle.errorMsg}>{this.state.confirmPasswordValidationMsg}</Text>
                        </View>
                        <View style={registerStyle.inputWrapperPhone}>
                            <TextInput
                                style={registerStyle.inputCode}
                                onChangeText={(code) => {this.setState({code});}}
                                value={this.state.code}
                                keyboardType = "numeric"
                                underlineColorAndroid='transparent'
                            />
                            <TextInput
                                placeholder = "Phone Number"
                                style={registerStyle.inputPhone}
                                onChangeText={(mobile) => {this.setState({mobile}); this.mobileValidation(mobile);}}
                                value={this.state.mobile}
                                keyboardType = "numeric"
                                underlineColorAndroid='transparent'
                            />
                        </View>
                        <Text style={[registerStyle.errorMsg, {width: "100%", marginTop: -10, marginBottom: 10}]}>{this.state.mobileValidationMsg}</Text>

                        <CheckBox
                            title='I agree the Terms and Privacy Policy'
                            checked={this.state.checked}
                            onPress = {this.tickHandle}
                        />
                        <Text style={[registerStyle.errorMsg, {marginTop: -5, marginLeft: 11, marginBottom: 10}]}>{this.state.termErrorMsg}</Text>
                        <TouchableOpacity
                            style={registerStyle.registerButton}
                            onPress={this.test}
                        >
                            <Text style={registerStyle.registerButtonText}> Create Account </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={registerStyle.helpContainer}>
                        <View style={registerStyle.loginContainer}>
                            <Text style={registerStyle.loginContainerText}>Already have an account?</Text>
                            <TouchableHighlight
                                onPress={this._handleNavigation.bind(this, 'Login')}
                            >
                                <Text style={registerStyle.loginLink} onClick>Login Here</Text>
                            </TouchableHighlight>
                        </View>
                        <View style={registerStyle.loginContainer}>
                            <TouchableHighlight
                                onPress={this._handleNavigation.bind(this, 'Privacy')}
                            >
                                <Text style={registerStyle.loginLink} onClick>Terms and Privacy Policy</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </View>
                </ScrollView>
            </View>
        )
    }
}

const registerStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f4f5f8"
    },
    formContainer : {
        flex: 1,
        justifyContent: "center",
        padding: 20
    },
    loginHeading : {
        marginTop: 50,
        fontSize: 18,
        color: "#555",
        fontFamily: "Raleway-Bold",
        textAlign: "center"
    },
    loginSubHeading : {
        marginTop: 12,
        marginBottom: 30,
        fontSize: 16,
        color: "#666",
        fontFamily: "Raleway-Medium",
        textAlign: "center"
    },
    inputWrapper : {
        marginBottom: 5
    },
    inputWrapperPhone : {
        marginBottom: 10,
        display: "flex",
        flexDirection: "row"
    },
    inputCode : {
        flex: 1,
        height: 40,
        borderColor: "#e1e1e1", 
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        backgroundColor: "#fff",
    },
    inputPhone : {
        flex: 7,
        height: 40,
        borderColor: "#e1e1e1", 
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        backgroundColor: "#fff",
    },
    input : {
        height: 40,
        borderColor: "#e1e1e1", 
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        color: "#333",
        backgroundColor: "#fff",
        fontFamily: "Roboto-Regular"
    },
    registerButton : {
        height: 40,
        backgroundColor: "#FF7417",
        alignSelf: "stretch",
        justifyContent: "center",
        borderRadius: 5
    },
    registerButtonText : {
        alignSelf: "center",
        color: "#fff",
        fontFamily: "OpenSans-SemiBold"
    },
    helpContainer : {
        flexDirection: "row",
        marginTop: 14
    },
    loginContainer : {
        flex: 1
    },
    loginContainerText : {
        fontFamily: "Roboto-Medium"
    },
    loginLink : {
        fontFamily : "Roboto-Medium",
        textDecorationLine: "underline",
        color: "#FD6A02"
    },
    errorMsg : {
        color: "red"
    }
});

export default EmailRegister;