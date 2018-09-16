import React, {Component} from "react";
import {StyleSheet, View, Text, Image, TextInput, Linking, TouchableOpacity, AsyncStorage, ScrollView} from 'react-native';
import SplashScreen from "../splashscreen";
import Toast, {DURATION} from 'react-native-easy-toast'
import axios from 'axios';
import md5 from 'md5';
import BottomNav from "../bottomNav";

import BottomNavigation,{FullTab} from 'react-native-material-bottom-navigation';
import { Icon } from 'react-native-elements'

class VideoList extends Component {
    constructor(props) {
        super(props);

        this._retrieveData();

        this.state = {
            userData: {},
            mobile: "",
            mobileValidationMsg: "",
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
                mobile: userData.mobile
            });
          } else {
              console.log("No data found");
          }
          this.setState({splashScreenActive: false});
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
            url: 'http://13.238.16.112/profile/updateMobile',
            headers : {
                'Content-Type' : 'application/json',
                'Authorization' : 'token '+this.state.userData.sessionId
            },
            data: {
                "mobile": this.state.mobile
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

    tabs = [
        {
          key: 'home',
          icon: 'home',
          navigate: 'HomeScreen',
          label: 'Home',
          barColor: '#388E3C',
          pressColor: 'rgba(255, 255, 255, 0.16)'
        },
        {
          key: 'analysis',
          icon: 'assessment',
          navigate: 'Analysis',
          label: 'Analysis',
          barColor: '#388E3C',
          pressColor: 'rgba(255, 255, 255, 0.16)'
        },
        {
          key: 'kten',
          icon: 'assignment',
          navigate: 'KTenTest',
          label: 'K10',
          barColor: '#388E3C',
          pressColor: 'rgba(255, 255, 255, 0.16)'
        },
        {
          key: 'videos',
          icon: 'videocam',
          navigate: 'VideosList',
          label: 'Videos',
          barColor: '#388E3C',
          pressColor: 'rgba(255, 255, 255, 0.16)'
        },
        {
            key: 'settings',
            icon: 'settings',
            navigate: 'Settings',
            label: 'Settings',
            barColor: '#388E3C',
            pressColor: 'rgba(255, 255, 255, 0.16)'
        }
      ]

      renderIcon = icon => ({ isActive }) => (
        <Icon size={16} color="white" name={icon} />
      )
    
      _handleNavigation = (navigateTo)=> {
        console.log(navigateTo);
        const { navigate } = this.props.navigation;
        navigate(navigateTo);
    }

       renderTab = ({ tab, isActive }) => {
        return (
          <FullTab
            style = {{marginLeft:-10}} 
            key={tab.key}
            isActive={isActive}
            label={tab.label}
            renderIcon={this.renderIcon(tab.icon)}
          />
        )
      }

    render() {
        return(
            this.state.splashScreenActive ? <SplashScreen /> :
            <View>
                
             <BottomNavigation
                renderTab={this.renderTab}
                tabs={this.tabs}
                onTabPress={activeTab => this._handleNavigation(activeTab.navigate)}
            /> 
            <TouchableOpacity
                    onPress={this._handleNavigation.bind(this, "EmotionScreen")}
                    style={videoListStyles.emotionButton}
                >
                    <Image
                        style={videoListStyles.emotionButtonImage}
                        source={require ('../../assets/images/mood/smilewhite.png')}
                    />
                </TouchableOpacity>

            <ScrollView>
            <View style={videoListStyles.container}>
                <Toast ref="toast"  position='top'/>
                
                
                <Text style={videoListStyles.headingText}>YOUTUBE VIDEOS</Text>
                    <View >
                            <TouchableOpacity
                                onPress = {() => Linking.openURL('https://www.youtube.com/watch?v=Hzgzim5m7oU')}
                            >
                                <View style={videoListStyles.listContainer}>
                                    <Image
                                        style={videoListStyles.videoImage}
                                        source={require ('../../assets/images/youtube.png')}
                                    />
                                    <Text style={videoListStyles.videoName}>The Power of Words</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress = {() => Linking.openURL('https://www.youtube.com/watch?v=tgS7bFWlqsw')}
                            >
                                <View style={videoListStyles.listContainer}>
                                    <Image
                                        style={videoListStyles.videoImage}
                                        source={require ('../../assets/images/youtube.png')}
                                    />
                                    <Text style={videoListStyles.videoName}>The Power of Words | Taylor Bertolini</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress = {() => Linking.openURL('https://www.youtube.com/watch?v=h-rRgpPbR5w')}
                            >
                                <View style={videoListStyles.listContainer}>
                                    <Image
                                        style={videoListStyles.videoImage}
                                        source={require ('../../assets/images/youtube.png')}
                                    />
                                    <Text style={videoListStyles.videoName}>Why you feel what you feel | Alan Watkins</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress = {() => Linking.openURL('https://www.youtube.com/watch?v=H2rG4Dg6xyI')}
                            >
                                <View style={videoListStyles.listContainer}>
                                    <Image
                                        style={videoListStyles.videoImage}
                                        source={require ('../../assets/images/youtube.png')}
                                    />
                                    <Text style={videoListStyles.videoName}>Isolation is the dream-killer, not your attitude | Barbara Sher</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress = {() => Linking.openURL('https://www.youtube.com/watch?v=IDPDEKtd2yM')}
                            >
                                <View style={videoListStyles.listContainer}>
                                    <Image
                                        style={videoListStyles.videoImage}
                                        source={require ('../../assets/images/youtube.png')}
                                    />
                                    <Text style={videoListStyles.videoName}>"I'm Fine" - Learning To Live With Depression | Jake Tyler</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress = {() => Linking.openURL('https://www.youtube.com/watch?v=-Qe8cR4Jl10')}
                            >
                                <View style={videoListStyles.listContainer}>
                                    <Image
                                        style={videoListStyles.videoImage}
                                        source={require ('../../assets/images/youtube.png')}
                                    />
                                    <Text style={videoListStyles.videoName}>Why we need to talk about depression | Kevin Breel</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress = {() => Linking.openURL('https://www.youtube.com/watch?v=7CIq4mtiamY')}
                            >
                                <View style={videoListStyles.listContainer}>
                                    <Image
                                        style={videoListStyles.videoImage}
                                        source={require ('../../assets/images/youtube.png')}
                                    />
                                    <Text style={videoListStyles.videoName}>The bridge between suicide and life | Keving Briggs</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress = {() => Linking.openURL('https://www.youtube.com/watch?v=k0GQSJrpVhM')}
                            >
                                <View style={videoListStyles.listContainer}>
                                    <Image
                                        style={videoListStyles.videoImage}
                                        source={require ('../../assets/images/youtube.png')}
                                    />
                                    <Text style={videoListStyles.videoName}>How to fix a broken heart | Guy Winch</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress = {() => Linking.openURL('https://www.youtube.com/watch?v=vo_lZiytsMw')}
                            >
                                <View style={videoListStyles.listContainer}>
                                    <Image
                                        style={videoListStyles.videoImage}
                                        source={require ('../../assets/images/youtube.png')}
                                    />
                                    <Text style={videoListStyles.videoName}>Change Your Mindset and Achieve Anything | Colin O'Brady</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress = {() => Linking.openURL('https://www.youtube.com/watch?v=fLJsdqxnZb0&t=330s')}
                                style={{marginBottom: 80}}
                            >
                                <View style={videoListStyles.listContainer}>
                                    <Image
                                        style={videoListStyles.videoImage}
                                        source={require ('../../assets/images/youtube.png')}
                                    />
                                    <Text style={videoListStyles.videoName}>The Happy Secret to Better Work | Shawn Achor</Text>
                                </View>
                            </TouchableOpacity>

                        
                    </View>
            </View>
                    </ScrollView>

                    </View>
        )
    }
}

const videoListStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 20
    },
    emotionButton : {
        position: "absolute",
        bottom: 80,
        right: 20,
        backgroundColor : "rgb(255,68,34)",
        zIndex: 10,
        padding: 15,
        borderRadius: 35,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 7,
    },
    emotionButtonImage : {
        height: 30,
        width: 30
    },
    headingText :{
        textAlign: "center",
        marginBottom: 40
    },
    listContainer: {
        borderBottomWidth: 1,
        borderColor: "#e9e9e9",
        marginBottom: 20
    },
    videoImage : {
        height: 70,
        width : 70
    },
    videoName : {
        position: "relative",
        right: 0,
        marginLeft: 90,
        top: -35,
        marginTop: -20,
        fontFamily: "Roboto-Medium",
        fontSize: 18,
        color: "#222"
    }
});

export default VideoList;