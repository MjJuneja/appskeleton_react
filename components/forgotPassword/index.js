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
            email: "",
            emailValidationMsg: ""
        };
    }

    validateEmail = email => {
        var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
        return re.test(email);
    }
    emailValidation = email => {
        if(this.validateEmail(email)) {
            this.setState({emailValidationMsg : ""});
        } else {
            this.setState({emailValidationMsg: "Enter a valid email address"});
        }
    }

    loginHandle = ()=> {
        this.refs.toast.show("Sending link...", 500, () => {
            // something you want to do at close
        });
        axios({
            method: 'post',
            url: 'http://13.238.16.112/forgotpassword/sendLink',
            headers : {
                'Content-Type' : 'application/json'
            },
            data: {
                "email": this.state.email
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
            <View style={loginStyle.container}>
                <Toast ref="toast"  position='top'/>
                <View style={loginStyle.formContainer}>
                    <Image
                        style={loginStyle.logo}
                        source={require ('../../assets/images/logo/LogoWatchYourTalk.jpg')}
                    />
                    <Text style={loginStyle.loginHeading}>Watch Your Talk</Text>
                    <View>
                        <TextInput
                            placeholder = "Email"
                            style={loginStyle.input}
                            onChangeText={(email) => {this.setState({email}); this.emailValidation(email)}}
                            value={this.state.email}
                            keyboardType = "email-address"
                        />
                        <Text style={{marginTop: -10, marginBottom: 10}}>{this.state.emailValidationMsg}</Text>
                        <TouchableOpacity
                            style={loginStyle.loginButton}
                            onPress={this.loginHandle}
                        >
                            <Text style={loginStyle.loginButtonText}> Send Link  </Text>
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
        backgroundColor: "#fff"
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
        borderColor: "#e9e9e9", 
        borderWidth: 1,
        marginBottom: 10,
        padding: 10
    },
    loginButton : {
        height: 40,
        backgroundColor: "#00ff00",
        alignSelf: "stretch",
        justifyContent: "center"
    },
    loginButtonText : {
        color: "#000",
        alignSelf: "center"
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

export default Login;