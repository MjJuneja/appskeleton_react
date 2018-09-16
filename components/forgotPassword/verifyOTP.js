import React, {Component} from "react";
import {StyleSheet, View, Text, Image, TextInput, TouchableOpacity} from 'react-native';
import SplashScreen from "../splashscreen";
import Toast, {DURATION} from 'react-native-easy-toast'
import axios from 'axios';
import md5 from 'md5';

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            code: "+61",
            mobile: "",
            mobileValidationMsg: ""
        };
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

        let mobileValidationMsg = "";

        mobileValidationMsg = this.mobileValidation(this.state.mobile);

        if(mobileValidationMsg=="") {

        axios({
            method: 'post',
            url: 'http://13.238.16.112/profile/updateMobile',
            headers : {
                'Content-Type' : 'application/json'
            },
            data: {
                "countryCode": this.state.code,
                "mobileNumber" : this.state.mobile
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
            <View style={loginStyle.container}>
                <Toast ref="toast"  position='top'/>
                <View style={loginStyle.formContainer}>
                    <Image
                        style={loginStyle.logo}
                        source={require ('../../assets/images/logo/logo.png')}
                    />
                    <Text style={loginStyle.loginHeading}>Watch Your Talk</Text>
                    <View>
                        {/* <TextInput
                            placeholder = "Email"
                            style={loginStyle.input}
                            onChangeText={(email) => {this.setState({email}); this.emailValidation(email)}}
                            value={this.state.email}
                            keyboardType = "email-address"
                            underlineColorAndroid='transparent'
                        />
                        <Text style={loginStyle.errorMsg}>{this.state.emailValidationMsg}</Text> */}

                        <View style={loginStyle.inputWrapperPhone}>
                            <TextInput
                                placeholder = "Enter OTP"
                                style={loginStyle.inputPhone}
                                onChangeText={(mobile) => {this.setState({mobile}); this.mobileValidation(mobile);}}
                                value={this.state.mobile}
                                keyboardType = "numeric"
                                underlineColorAndroid='transparent'
                            />
                        </View>
                        <Text style={[loginStyle.errorMsg, {width: "100%", marginTop: -10, marginBottom: 10}]}>{this.state.mobileValidationMsg}</Text>

                        <TouchableOpacity
                            style={loginStyle.loginButton}
                            onPress={this.loginHandle}
                        >
                            <Text style={loginStyle.loginButtonText}> Verify OTP  </Text>
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
    errorMsg : {
        color: "red",
        marginBottom: 10
    }
});

export default Login;


