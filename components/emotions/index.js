import React, {Component} from "react";
import {StyleSheet, View, Text, Image, Button, TouchableOpacity, AsyncStorage, ScrollView} from 'react-native';
import SplashScreen from "../splashscreen";
import Toast, {DURATION} from 'react-native-easy-toast'
import axios from 'axios';
import md5 from 'md5';
import moment from 'moment';

class EmotionScreen extends Component {
    constructor(props) {
        super(props);

        this._retrieveData();


        this.state = {
            userData: {},
            moods : [
                "Very Good",
                "Good",
                "Moderate",
                "Bad",
                "Very Bad"
            ],
            moodsIcon : [
                "../../assets/images/mood/good.png",
                "../../assets/images/mood/very_good.png",
                "../../assets/images/mood/moderate.png",
                "../../assets/images/mood/bad.png",
                "../../assets/images/mood/very_bad.png"
            ],
            currentMood : "",
            moodEnable: false,
            splashscreenActive: true,
            moodTimeR: "Loading..."
        };
    }

    _retrieveData = async () => {
        console.log("in retrieve data");
        try {
          const userData = await AsyncStorage.getItem('userData');
          let moodTime = await AsyncStorage.getItem('moodTime');
            if(moodTime==null) {
                this.setState({moodEnable: true});
            } else {
                let moodTimeLater = moment(moodTime).add(4, "hours").toDate().toISOString();
                console.log("mood time", moodTime);
                console.log("after 4 hours time", moodTimeLater);
                let currentTime = moment().toDate().toISOString();
                if(moment(moodTimeLater).isBefore(currentTime)) {
                    this.setState({moodEnable: true});
                } else {
                    this.setState({moodEnable: false});
                    let timems = moment(moodTime).add(4, 'hours').valueOf();
                    let moodTimeInterval = setInterval(()=>{
                        let currentTimems = moment().valueOf();
                        let diff = timems-currentTimems;
                        if(diff>0) {
                            let diffconverted = this.convertMS(diff);
                            console.log(diffconverted);
                            this.setState({moodTimeR: diffconverted});
                        } else {
                            this.setState({moodEnable: true});
                            clearInterval(moodTimeInterval);
                        }
                    }, 1000);
                }
            }
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
          this.setState({splashscreenActive: false});
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

    convertMS = ms=> {
        var d, h, m, s;
        s = Math.floor(ms / 1000);
        m = Math.floor(s / 60);
        s = s % 60;
        h = Math.floor(m / 60);
        m = m % 60;
        d = Math.floor(h / 24);
        h = h % 24;
        h += d * 24;
        return h + ':' + m + ':' + s;
    }

    moodSelect = (index)=> {
        let currentMood = this.state.moods[index];
        this.setState({currentMood});
    }

    _handleNavigation = (navigateTo)=> {
        console.log(navigateTo);
        const { navigate } = this.props.navigation;
        navigate(navigateTo);
    }

    _setMood = async()=> {
        console.log("type : ", typeof(this.state.currentMood));
        console.log("in set mood, ", this.state.currentMood);
        let time = moment().toDate().toISOString();
        await AsyncStorage.setItem('currentMood', this.state.currentMood);
        await AsyncStorage.setItem('moodTime', time);
        console.log("emotion set");
        this._handleNavigation('Analysis');

    }

    render() {
        
        return(
            this.state.splashscreenActive ? <SplashScreen /> :
            <View style={loginStyle.container}>
            <ScrollView>
                <Toast ref="toast"  position='top'/>
                <Text style={loginStyle.headingText}>HOW DO YOU FEEL RIGHT NOW?</Text>

                <View style={loginStyle.emoticonsContainer}>

                <View style={loginStyle.positionContainer}>
                <View style={{"flex": 1}}></View>
                <View style={{"flex": 2}}>
                    <TouchableOpacity
                        onPress={this.moodSelect.bind(this, 0)}
                        style={{alignSelf: "center"}}
                    >
                        <Image
                            style={loginStyle.moodImage}
                            source={require ('../../assets/images/mood/very_good.png')}
                        />
                        <Text style={loginStyle.emotionText}>Very Good</Text>
                    </TouchableOpacity>
                    </View>
                    <View style={{"flex": 2}}>
                    <TouchableOpacity
                        onPress={this.moodSelect.bind(this, 1)}
                        style={{alignSelf: "center"}}
                    >
                        <Image
                            style={loginStyle.moodImage}
                            source={require ('../../assets/images/mood/good.png')}
                        />
                        <Text style={loginStyle.emotionText}>Good</Text>
                    </TouchableOpacity>
                    </View>

                <View style={{"flex": 1}}></View>
                </View>

                <View style={loginStyle.positionContainer}>
                <View style={{"flex": 1}}>
                    <TouchableOpacity
                        onPress={this.moodSelect.bind(this, 2)}
                        style={{alignSelf: "center"}}
                    >
                        <Image
                            style={loginStyle.moodImage}
                            source={require ('../../assets/images/mood/moderate.png')}
                        />
                        <Text style={loginStyle.emotionText}>Moderate</Text>
                    </TouchableOpacity>
                    </View>
                    <View style={{"flex": 1}}>
                    <TouchableOpacity
                        onPress={this.moodSelect.bind(this, 3)}
                        style={{alignSelf: "center"}}
                    >
                        <Image
                            style={loginStyle.moodImage}
                            source={require ('../../assets/images/mood/bad.png')}
                        />
                        <Text style={loginStyle.emotionText}>Bad</Text>
                    </TouchableOpacity>
                    </View>
                </View>

                <View style={loginStyle.positionContainer}>
                <View style={{"flex": 1}}>
                    <TouchableOpacity
                        onPress={this.moodSelect.bind(this, 4)}
                        style={{alignSelf: "center"}}
                    >
                        <Image
                            style={loginStyle.moodImage}
                            source={require ('../../assets/images/mood/very_bad.png')}
                        />
                        <Text style={loginStyle.emotionText}>Very Bad</Text>
                    </TouchableOpacity>
                    </View>
                </View>
                </View>

                {this.state.moodEnable ? 
                this.state.currentMood!="" ?
                <View>
                    <Text style={loginStyle.currentMoodText}>{this.state.currentMood}</Text>
                    <TouchableOpacity
                        style={loginStyle.confirmButton}
                        onPress={this._setMood}
                    >
                    <Text style={loginStyle.confirmButtonText}>Confirm</Text>
                    </TouchableOpacity>
                </View> : <Text style={loginStyle.currentMoodText}>Select a mood</Text>
                : <View>
                    <Text style={[loginStyle.currentMoodText, loginStyle.timerStyle]}>{this.state.moodTimeR}</Text>
                    <Text style={loginStyle.currentMoodText}>Hold tight! Come back again later.</Text>
                </View>
                }
                </ScrollView>
            </View>
        )
    }
}

const loginStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    },
    moodImage : {
        height: 90,
        width: 90,
        backgroundColor: "orange"
    },
    logo : {
        height: 120,
        width: 100,
        alignSelf: "center"
    },
    positionContainer : {
        // display: "flex",
        flexDirection: "row",
        marginBottom: 40
        // flex: 1
    },
    headingText : {
        color: "#999",
        fontSize: 13,
        alignSelf: "center",
        marginBottom: 20,
        marginTop: 20
    },
    emoticonsContainer : {
        marginBottom: 30,
        // flexDirection: "column",
        // justifyContent: "center"
    },
    emotionText : {
        alignSelf: "center",
        fontFamily: "Roboto-Medium",
        color: "#444",
        fontSize: 15
    },
    currentMoodText : {
        fontFamily: "Roboto-Medium",
        fontSize: 18,
        color: "#222",
        textAlign: "center"
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
    },
    iconButton: {
        flex: 1,
        justifyContent: "center"
    },
    confirmButton : {
        height: 40,
        backgroundColor: "rgb(255,68,34)",
        width: "70%",
        justifyContent: "center",
        alignSelf: "center",
        borderRadius: 5,
        marginTop: 12
    },
    confirmButtonText: {
        alignSelf: "center",
        color: "#fff",
        fontFamily: "OpenSans-SemiBold"
    },
    timerStyle : {
        backgroundColor: "#f1f1f1",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginBottom: 5
    }
});

export default EmotionScreen;