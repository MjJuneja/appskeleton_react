import React, {Component} from "react";
import {StyleSheet, View, Text, Image, TextInput, TouchableOpacity, TouchableHighlight, Linking, ScrollView, AsyncStorage} from 'react-native';
import axios from 'axios';
import md5 from 'md5';
import Toast, {DURATION} from 'react-native-easy-toast';

class Profile extends Component {
    constructor(props) {
        super(props);

        this._retrieveData();

        this.state = {
            "firstName":"",
            "lastName":"",
            "area":"",
            "city":"",
            "state":"",
            "pincode":"",
            "country":"",
            "userData" : {},

            "userEmail":"nikhil@gmail.com",
            "username":"nikhil",
            "password":"",
            "code":"+91",
            "mobile":"",
            "role":"customer",
            "emailValidationMsg" : "",
            "usernameValidationMsg" : "",
            "firstNameValidationMsg" : "",
            "lastNameValidationMsg" : "",
            "passwordValidationMsg" : "",
            "confirmPasswordValidateMsg" : "",
            "mobileValidationMsg" : "",
            "editProfileEnabled" : false,
            "editProfileButton" : "Edit Profile",

            "areaValidationMsg" : "",
            "cityValidationMsg" : "",
            "stateValidationMsg" : "",
            "countryValidationMsg" : "",
            loading: false
        };
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
            this.setState({
                userData,
                firstName: userData.userInfo.firstName,
                lastName: userData.userInfo.lastName,
                area: userData.userInfo.area,
                city: userData.userInfo.city,
                state: userData.userInfo.state,
                pincode: userData.userInfo.pincode,
                country: userData.userInfo.country,
            });
          } else {
              console.log("No data found");
          }
         } catch (error) {
           // Error retrieving data
           console.log(error);
         }
      }

      _storeData = async (userData) => {
        try {
          userData = JSON.stringify(userData);
          console.log("in store data");
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

    validatePincode = pincode => {
        var re = /^([0-9]{6})$/;
        return re.test(pincode);
    }
    pincodeValidation = pincode => {
        if(this.validatePincode(pincode)) {
            this.setState({pincodeValidationMsg: ""});
        } else {
            this.setState({pincodeValidationMsg: "Invalid Pincode"});
        }
    }

    nameValidation = (name, position) => {
        console.log(name);
        if(name == "") {
            if(position == 1) {
                this.setState({firstNameValidationMsg: "First Name cannot be empty"});
            } else if(position == 2) {
                this.setState({lastNameValidationMsg: "Last Name cannot be empty"});
            } else if(position == 3) {
                this.setState({areaValidationMsg: "Area cannot be empty"});
            } else if(position == 4) {
                this.setState({cityValidationMsg: "City cannot be empty"});
            } else if(position == 5) {
                this.setState({stateValidationMsg: "State cannot be empty"});
            } else if(position == 6) {
                this.setState({countryValidationMsg: "Country cannot be empty"});
            } else {
                console.log("error");
            }
        } else {
            this.setState({firstNameValidationMsg: ""});
        }
    }

    validatePassword = password => {
        var re = /^[a-z0-9A-Z!@#$%^&*()_.]{8,25}$/;
        return re.test(password);
    }
    passwordValidation = (password)=> {
        if(this.validatePassword(password)) {
            this.setState({passwordValidationMsg: ""});
        } else {
            this.setState({passwordValidationMsg: "Password too small or invalid character,use(8-25 char)(a-z,0-9,A-Z,!,@,#,$,%,^,&,*,(,),_,.)"});
        }
    }

    confrimPasswordValidation = (confrimPassword)=> {
        if(confrimPassword !== this.state.password) {
            this.setState({confirmPasswordValidationMsg: "Password did not match"});
        } else {
            this.setState({confirmPasswordValidationMsg: ""});
        }
    }

    validateMobile = mobile => {
        var re = /^[0-9]{10}$/;
        return re.test(mobile);
    }
    mobileValidation = mobile => {
        if(this.validateMobile(mobile)) {
            this.setState({mobileValidationMsg: ""});
        } else {
            this.setState({mobileValidationMsg: "Invalid Mobile Number"})
        }
    }

    loginHandle = ()=> {
        alert("Register button pressed");
    }

    editProfile = (updateCheck)=> {
        console.log(updateCheck);
        let dataF = {
            "firstName":this.state.firstName,
            "lastName":this.state.lastName,
            "area":this.state.area,
            "city": this.state.city,
            "state": this.state.state,
            "pincode": this.state.pincode,
            "country": this.state.country	
        }
        console.log(dataF);
        if(updateCheck===false) {
            this.setState({editProfileEnabled: true, editProfileButton: "Update Profile"});
        } else {
            axios({
                method: 'post',
                url: 'http://13.238.16.112/profile/updateProfileData',
                headers : {
                    'Content-Type' : 'application/json',
                    'Authorization' : 'token '+this.state.userData.sessionId
                },
                data: dataF
              }).then(data => {
                  console.log(data.data);
                  this.refs.toast.show(data.data.message, 1000, () => {
                    // something you want to do at close
                });
                // this._storeData(dataF);
                this.setState({editProfileEnabled: false, editProfileButton: "Edit Profile"});
              }).catch(err=>{
                    console.log(err);  
              });
        }
    }
    

    render() {
        return(
            this.state.loading ? <Text>Loading...</Text> :
            <View style={registerStyle.container}>
                <Toast ref="toast"  position='top'/>
                <ScrollView>
                    <View style={registerStyle.formUsernameContainer}>
                        <Text style={{height: 100, width: 100, borderRadius: 5, backgroundColor: "#f1f1f1", marginBottom: 10, alignSelf:"center"}}></Text>
                        <Text style={{fontSize: 16, alignSelf:"center", color: "#333"}}>Username: {this.state.username}</Text>
                        <TouchableHighlight onPress={this._handleNavigation.bind(this, "ChangeUsername")}>
                            <Text style={{fontSize: 14, color: "#888", marginBottom: 10, alignSelf:"center"}}>Change Username</Text>
                        </TouchableHighlight>
                        <Text style={{fontSize: 16, alignSelf:"center", color: "#333"}}>Email: {this.state.userEmail}</Text>
                    </View>
                    <View style={registerStyle.formContainer}>
                        {/* <View style={registerStyle.inputWrapper}>
                            <TextInput
                                placeholder = "Email"
                                style={registerStyle.input}
                                onChangeText={(userEmail) => {this.setState({userEmail}); this.emailValidation(userEmail);}}
                                value={this.state.userEmail}
                                keyboardType = "email-address"
                                underlineColorAndroid='transparent'
                                editable={this.state.editProfileEnabled} selectTextOnFocus={this.state.editProfileEnabled}
                            />
                            <Text>{this.state.emailValidationMsg}</Text>
                        </View>
                        <View style={registerStyle.inputWrapper}>
                            <TextInput
                                placeholder = "Username"
                                style={registerStyle.input}
                                onChangeText={(username) => {this.setState({username}); this.usernameValidation(username)}}
                                value={this.state.username}
                                underlineColorAndroid='transparent'
                                editable={this.state.editProfileEnabled} selectTextOnFocus={this.state.editProfileEnabled}
                            />
                            <Text>{this.state.usernameValidationMsg}</Text>
                        </View> */}
                        <View>
                            <View style={registerStyle.inputWrapper}>
                                <TextInput
                                    placeholder = "First Name"
                                    style={this.state.editProfileEnabled ? registerStyle.inputActive : registerStyle.input}
                                    onChangeText={(firstName) => {this.setState({firstName}); this.nameValidation(firstName, 1);}}
                                    value={this.state.firstName}
                                    underlineColorAndroid='transparent'
                                    editable={this.state.editProfileEnabled} selectTextOnFocus={this.state.editProfileEnabled}
                                />
                                <Text style={registerStyle.errorMsg}>{this.state.firstNameValidationMsg}</Text>
                            </View>
                            <View style={registerStyle.inputWrapper}>
                                <TextInput
                                    placeholder = "Last Name"
                                    style={this.state.editProfileEnabled ? registerStyle.inputActive : registerStyle.input}
                                    onChangeText={(lastName) => {this.setState({lastName}); this.nameValidation(lastName, 2);}}
                                    value={this.state.lastName}
                                    underlineColorAndroid='transparent'
                                    editable={this.state.editProfileEnabled} selectTextOnFocus={this.state.editProfileEnabled}
                                />
                                <Text style={registerStyle.errorMsg}>{this.state.lastNameValidationMsg}</Text>
                            </View>
                            
                            <View style={registerStyle.inputWrapper}>
                                <TextInput
                                    placeholder = "Area"
                                    style={this.state.editProfileEnabled ? registerStyle.inputActive : registerStyle.input}
                                    onChangeText={(area) => {this.setState({area}); this.nameValidation(area, 3);}}
                                    value={this.state.area}
                                    underlineColorAndroid='transparent'
                                    editable={this.state.editProfileEnabled} selectTextOnFocus={this.state.editProfileEnabled}
                                />
                                <Text style={registerStyle.errorMsg}>{this.state.areaValidationMsg}</Text>
                            </View>
                            <View style={registerStyle.inputWrapper}>
                                <TextInput
                                    placeholder = "City"
                                    style={this.state.editProfileEnabled ? registerStyle.inputActive : registerStyle.input}
                                    onChangeText={(city) => {this.setState({city}); this.nameValidation(city, 4);}}
                                    value={this.state.city}
                                    underlineColorAndroid='transparent'
                                    editable={this.state.editProfileEnabled} selectTextOnFocus={this.state.editProfileEnabled}
                                />
                                <Text style={registerStyle.errorMsg}>{this.state.cityValidationMsg}</Text>
                            </View>
                            <View style={registerStyle.inputWrapper}>
                                <TextInput
                                    placeholder = "State"
                                    style={this.state.editProfileEnabled ? registerStyle.inputActive : registerStyle.input}
                                    onChangeText={(state) => {this.setState({state}); this.nameValidation(state, 5);}}
                                    value={this.state.state}
                                    underlineColorAndroid='transparent'
                                    editable={this.state.editProfileEnabled} selectTextOnFocus={this.state.editProfileEnabled}
                                />
                                <Text style={registerStyle.errorMsg}>{this.state.stateValidationMsg}</Text>
                            </View>
                            <View style={registerStyle.inputWrapper}>
                                <TextInput
                                    placeholder = "Pincode"
                                    style={this.state.editProfileEnabled ? registerStyle.inputActive : registerStyle.input}
                                    onChangeText={(pincode) => {this.setState({pincode}); this.pincodeValidation(pincode, 6);}}
                                    value={this.state.pincode}
                                    underlineColorAndroid='transparent'
                                    keyboardType = "numeric"
                                    editable={this.state.editProfileEnabled} selectTextOnFocus={this.state.editProfileEnabled}
                                />
                                <Text style={registerStyle.errorMsg}>{this.state.pincodeValidationMsg}</Text>
                            </View>
                            <View style={registerStyle.inputWrapper}>
                                <TextInput
                                    placeholder = "Country"
                                    style={this.state.editProfileEnabled ? registerStyle.inputActive : registerStyle.input}
                                    onChangeText={(country) => {this.setState({country}); this.nameValidation(country, 6);}}
                                    value={this.state.country}
                                    underlineColorAndroid='transparent'
                                    editable={this.state.editProfileEnabled} selectTextOnFocus={this.state.editProfileEnabled}
                                />
                                <Text style={registerStyle.errorMsg}>{this.state.countryValidationMsg}</Text>
                            </View>
                            <View style={{marginBottom: 10}}>
                                <TouchableOpacity
                                    style={registerStyle.loginButton}
                                    onPress={this.editProfile.bind(this, this.state.editProfileEnabled)}
                                >
                                    <Text style={registerStyle.loginButtonText}>{this.state.editProfileButton}</Text>
                                </TouchableOpacity>
                            </View>


                            {/* <View style={registerStyle.inputWrapper}>
                                <TextInput
                                    placeholder = "Password"
                                    style={registerStyle.input}
                                    onChangeText={(password) => {this.setState({password}); this.passwordValidation(password);}}
                                    value={this.state.password}
                                    underlineColorAndroid='transparent'
                                />
                                <Text>{this.state.passwordValidationMsg}</Text>
                            </View>
                            <View style={registerStyle.inputWrapper}>
                                <TextInput
                                    placeholder = "Confirm Password"
                                    style={registerStyle.input}
                                    onChangeText={(confirmPassword) => {this.setState({confirmPassword}); this.confrimPasswordValidation(confirmPassword);}}
                                    value={this.state.confirmPassword}
                                    underlineColorAndroid='transparent'
                                />
                                <Text>{this.state.confirmPasswordValidationMsg}</Text>
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
                            </View> */}
                            {/* <Text style={{width: "100%", marginTop: -10, marginBottom: 10}}>{this.state.mobileValidationMsg}</Text> */}
                            {this.state.editProfileEnabled? 
                                <TouchableOpacity
                                    style={registerStyle.loginButton}
                                    onPress={()=> {this.setState({editProfileEnabled: false})}}
                                >
                                    <Text style={registerStyle.loginButtonText}>Cancel</Text>
                                </TouchableOpacity>
                            : 
                            <View style={{display: "flex", flexDirection: "row"}}>  
                                <View style={{flex: 1, marginRight: 2}}> 
                                    <TouchableOpacity
                                        style={registerStyle.loginButton}
                                        onPress={this.test}
                                    >
                                        <Text style={registerStyle.loginButtonText}> Edit Mobile </Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{flex: 1, marginLeft: 2}}>
                                    <TouchableOpacity
                                        style={registerStyle.loginButton}
                                        onPress={this._handleNavigation.bind(this, "ChangePassword")}
                                    >
                                        <Text style={registerStyle.loginButtonText}> Change Password </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            }
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
        backgroundColor: "#f4f5f8",
        justifyContent: "center"
    },
    profileImageWrapper : {
        // height: 240,
        flex: 1,
        justifyContent: "center"
    },
    gradientBackground : {
        height: 240,
        width: "100%",
        position: "absolute",
        top: 0
    },
    formContainer : {
        flex: 1,
        justifyContent: "center",
        padding: 20
    },
    formUsernameContainer : {
        marginLeft: "3%",
        marginRight: "3%",
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
    inputWrapperPhone : {
        marginBottom: 10,
        display: "flex",
        flexDirection: "row"
    },
    inputCode : {
        flex: 1,
        height: 40,
        borderColor: "#e9e9e9", 
        borderWidth: 1,
        padding: 10
    },
    inputPhone : {
        flex: 7,
        height: 40,
        borderColor: "#e9e9e9", 
        borderWidth: 1,
        padding: 10
    },
    input : {
        height: 40,
        borderColor: "#e1e1e1", 
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        color: "#333",
        backgroundColor: "#e9e9e9",
        fontFamily: "Roboto-Regular"
    },
    inputActive : {
        height: 40,
        borderColor: "#d1d1d1", 
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        color: "#333",
        backgroundColor: "#fff",
        fontFamily: "Roboto-Regular",
        borderBottomWidth: 2
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
        color: "red"
    }
});

export default Profile;