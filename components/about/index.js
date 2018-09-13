import React, {Component} from "react";
import {StyleSheet, View, Text, Image, AsyncStorage} from 'react-native';
import SplashScreen from "../splashscreen";
import Toast, {DURATION} from 'react-native-easy-toast'
import axios from 'axios';

class AboutScreen extends Component {

    constructor(props) {
        super(props);
        this._retrieveData();
        this.state = {
            userData: {},
            username: "",
            splashScreenActive: true,
            usernameValidationMsg: ""
        };
    }

    // Check if user data exists in AsyncStorage
    _retrieveData = async () => {
        console.log("in retrieve data");
        try {
            const userData = await AsyncStorage.getItem('userData');
            if (userData !== null) {
                userData = JSON.parse(userData);
                // console.log(userData);

                // Verify token
                this._checkToken(userData.sessionId);

                // Set data to AsyncStorage
                this.setState({userData});
            } else {
                // No data available in AsyncStorage
                console.log("No data found");
            }
        } catch (error) {
            // Error retrieving data
            console.log(error);
        }
    }

    // API hit to verify token
    _checkToken = token => {
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
            // console.log(data.data);
            if(data.data.message=="Access denied") {
                // If token expired
                this._removeData();
                this._handleNavigation('Home');
            } else {
                this.setState({splashScreenActive: false});
            }
        }).catch(err=>{
            // Error while making API call
            console.log(err);
        });
    }
    _removeData = async()=> {
        // Remove data if token has expired
        try {
            const userData = await AsyncStorage.removeItem('userData');
        } catch (error) {
            console.log(error);
        }
    }

    // Function to handle navigation
    _handleNavigation = (navigateTo)=> {
        const { navigate } = this.props.navigation;
        navigate(navigateTo);
    }

    render() {
        return(
            this.state.splashScreenActive ? 
                <SplashScreen /> 
            :
                <View style={aboutStyle.container}>
                    <Toast ref="toast"  position='top'/>
                    <Image
                        style={aboutStyle.logo}
                        source={require ('../../assets/images/logo/logo.png')}
                    />
                    <Text style={aboutStyle.description}>Watchyourtalk is a pioneer in the field of mobile personal development.</Text>
                    <Text style={aboutStyle.description}>Founded in 2018, Watchyourtalk is on a mission to help people reduce stress, anxiety and general well-being.</Text>
                    <Text style={aboutStyle.description}>Visit our website - www.watchyourtalk.com</Text> 
                    {/* <TouchableOpacity onPress={() => Linking.openURL('https://www.watchyourtalk.com')}><Text style={{alignSelf: "center", color: "blue", fontFamily: "Roboto-Medium", fontSize: 16, marginBottom: 10}}>www.watchyourtalk.com</Text></TouchableOpacity> */}
                </View>
        )
    }
}

const aboutStyle = StyleSheet.create({
    container : {
        flex: 1,
        backgroundColor: "#f4f5f8",
        justifyContent: "center",
        padding: 20
    },
    logo : {
        height: 120,
        width: 100,
        alignSelf: "center",
        marginBottom: 20,
        marginTop: 20
    },
    description : {
        alignSelf: "center",
        fontFamily: "Roboto-Medium",
        fontSize: 16,
        marginBottom: 10
    }
});

export default AboutScreen;