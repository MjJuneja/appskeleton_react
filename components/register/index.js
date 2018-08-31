import React, {Component} from "react";
import {StyleSheet, View, Text, Image, TextInput, TouchableOpacity, Linking} from 'react-native';

class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            username: "",
            password: "",
            confirmPassword: "",
            passwordValidationMsg: "",
            confirmPasswordValidationMsg: "",
            usernameValidationMsg: ""
        };
    }

    validateUsername = (username) => {
        var re = /^([a-zA-Z0-9_.]{5,20})$/;
        return re.test(username);
    };

    usernameValidation = (username)=> {
        if(this.validateUsername(username)) {
            this.setState({usernameValidationMsg : ""});
        } else {
            this.setState({usernameValidationMsg: "Enter a valid username address"});
        }
    }

    passwordValidation = (password)=> {
        if(password.length < 8) {
            this.setState({passwordValidationMsg: "Password should be 8 characters long"});
        } else {
            this.setState({passwordValidationMsg: ""});
        }
    }

    confrimPasswordValidation = (confrimPassword)=> {
        if(confrimPassword !== this.state.password) {
            this.setState({confirmPasswordValidationMsg: "Password did not match"});
        } else {
            this.setState({confirmPasswordValidationMsg: ""});
        }
    }

    loginHandle = ()=> {
        alert("Register button pressed");
    }

    render() {
        return(
            <View style={registerStyle.container}>
                <View style={registerStyle.formContainer}>
                    <Text style={registerStyle.loginHeading}>Register</Text>
                    <View>
                        <View style={registerStyle.inputWrapper}>
                            <TextInput
                                placeholder = "Email"
                                style={registerStyle.input}
                                onChangeText={(email) => {this.setState({email});}}
                                value={this.state.email}
                                keyboardType = "email-address"
                            />
                        </View>
                        <View style={registerStyle.inputWrapper}>
                            <TextInput
                                placeholder = "Username"
                                style={registerStyle.input}
                                onChangeText={(username) => {this.setState({username}); this.usernameValidation(username)}}
                                value={this.state.username}
                            />
                            <Text>{this.state.usernameValidationMsg}</Text>
                        </View>
                        <View style={registerStyle.inputWrapper}>
                            <TextInput
                                placeholder = "Password"
                                style={registerStyle.input}
                                onChangeText={(password) => {this.setState({password}); this.passwordValidation(password);}}
                                value={this.state.password}
                                secureTextEntry={true}

                            />
                            <Text>{this.state.passwordValidationMsg}</Text>
                        </View>
                        <View style={registerStyle.inputWrapper}>
                            <TextInput
                                placeholder = "Confirm Password"
                                style={registerStyle.input}
                                onChangeText={(confirmPassword) => {this.setState({confirmPassword}); this.confrimPasswordValidation(confirmPassword);}}
                                value={this.state.confirmPassword}
                                secureTextEntry={true}
                            />
                            <Text>{this.state.confirmPasswordValidationMsg}</Text>
                        </View>
                        <TouchableOpacity
                            style={registerStyle.loginButton}
                            onPress={this.loginHandle}
                        >
                            <Text style={registerStyle.loginButtonText}> Register </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={registerStyle.helpContainer}>
                        <View style={registerStyle.registerContainer}>
                            <Text>Already have an account?</Text>
                            <Text style={{color: "orangered", fontWeight: "bold"}}>Login Here</Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}

const registerStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
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
        color: "#222"
    },
    inputWrapper : {
        marginBottom: 10
    },
    input : {
        height: 40,
        borderColor: "#e9e9e9", 
        borderWidth: 1,
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

export default Register;