import React from 'react';
import { StyleSheet, Text, View, Image, Button , AsyncStorage, ToastAndroid, TouchableOpacity, FlatList,BackHandler } from 'react-native';
import BottomNavigation,{FullTab} from 'react-native-material-bottom-navigation';
import { Icon } from 'react-native-elements';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import SplashScreen from '../splashscreen';
import axios from 'axios';

export default class Settings extends React.Component {
  constructor(props){
    super(props);
    
    this._retrieveData();

    // this.props.navigation.addEventListener('didFocus',BackHandler.addEventListener('hardwareBackPress', this.handleBackPress));  
    this.state = {
        username:'',
        message:'',
        micIcon : 'mic',
        // options : [
        //         {key: 'Profile', icon: micIcon},
        //         {key: 'Microphone', icon: 'mic'},
        //         {key: 'About', icon: 'timeline'},
        //         {key: 'Logout', icon: 'power-settings-new'}
        //     ],
        splashScreenActive: true
    };

    console.log(this.props);
  }
  
  static navigationOptions = {
    title: 'Welcome',
  };

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
      barColor: '#B71C1C',
      pressColor: 'rgba(255, 255, 255, 0.16)'
    },
    {
      key: 'kten',
      icon: 'assignment',
      navigate: 'KTenTest',
      label: 'K10',
      barColor: '#E64A19',
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
        barColor: '#ff3782',
        pressColor: 'rgba(255, 255, 255, 0.16)'
    }
  ]

  navigateSettings = key => {

    const { navigate } = this.props.navigation;
      if(key=="Profile") {
        const { navigate } = this.props.navigation;
        navigate('Profile');
      } else if (key == "Microphone") {
        this._changeMicStatus();
      } else if (key=="About") {
        navigate('AboutScreen');
      } else if (key=="Logout") {
        this._removeData();
        const { navigate } = this.props.navigation;
        navigate('Home');
      }
  }
  
    //   }

      handleBackPress = () => {
          console.log("return false");
          return false;
      }

  _handleNavigation = (navigateTo)=> {
    console.log(navigateTo);
    const { navigate } = this.props.navigation;
    navigate(navigateTo);
}

   renderIcon = icon => ({ isActive }) => (
    <Icon size={20} color="white" name={icon} />
  )

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

  _retrieveData = async () => {
    console.log("in retrieve data");
    try {
      const userData = await AsyncStorage.getItem('userData');
    //   const micFlag = await AsyncStorage.getItem('micFlag');
      if (userData !== null) {
        // We have data!!
        userData = JSON.parse(userData);
        console.log(userData);
        this.checkToken(userData.sessionId);
        this.setState({userData});
        this._retrieveMicStatusInitial();
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

  _retrieveMicStatusInitial = async () => {
    console.log("in retrieve data mic initial");
    try {
      let micFlag = await AsyncStorage.getItem('micFlag')
      if(micFlag==null)
        this.setState({micIcon: 'mic'});
    
     if(micFlag=="OFF") {
      this.setState({micIcon: 'mic-off'});
     } else {
      this.setState({micIcon: 'mic'});
     }
      console.log("micflag changed, ", micFlag);
  } catch (error) {
    console.log(error);
  }
}

  _retrieveMicStatus = async () => {
    console.log("in retrieve data");
    try {
      let micFlag = await AsyncStorage.getItem('micFlag')
      console.log("mic value returned");
      console.log("after returning");
      if(micFlag==null) {
        micFlag = "ON";
      }
    
     if(micFlag=="OFF") {
         micFlag  = "ON";
         this.setState({micIcon: 'mic'});
     } else {
         micFlag = "OFF";
         this.setState({micIcon: 'mic-off'});
     }
      await AsyncStorage.setItem('micFlag', micFlag );
      console.log("micflag changed, ", micFlag);
      
      

      ToastAndroid.showWithGravityAndOffset(
        micFlag,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
     } catch (error) {
       console.log(error);
     }
  }

  _changeMicStatus = async () => {
    try {
      this._retrieveMicStatus();
    //   console.log("after returning");
    //   if(micFlag==null)
    //     micFlag = "OFF";
    
    //  if(micFlag=="OFF") {
    //      micFlag  = "ON";
    //  } else {
    //      micFlag = "OFF";
    //  }
    //   await AsyncStorage.setItem('micFlag', micFlag );
    //   console.log("micflag changed, ", micFlag);
    //   ToastAndroid.showWithGravityAndOffset(
    //     micFlag,
    //     ToastAndroid.LONG,
    //     ToastAndroid.BOTTOM,
    //     25,
    //     50
    //   );
    } catch (error) {
      // Error saving data
      console.log(error);
    }
  }

  render() {
    
    return (
      this.state.splashScreenActive ? <SplashScreen /> :
       <View style={settingStyles.container}>
           <BottomNavigation
                renderTab={this.renderTab}
                tabs={this.tabs}
                onTabPress={activeTab => this._handleNavigation(activeTab.navigate)}
            /> 
           <View>
               <View style={settingStyles.headingWrapper}>
                   <Text style={settingStyles.headingText}>APP SETTINGS</Text>
               </View>
               <View style={settingStyles.settingOptionsWrapper}>
               {/* options : [
        //         {key: 'Profile', icon: micIcon},
        //         {key: 'Microphone', icon: 'mic'},
        //         {key: 'About', icon: 'timeline'},
        //         {key: 'Logout', icon: 'power-settings-new'}
            ], */}
  

                <TouchableOpacity
                            key={"Profile"}
                            style={settingStyles.settingOptionsButton}
                            onPress={this.navigateSettings.bind(this, "Profile")}
                        >
                            <View style={settingStyles.icons}>
                                <Icon size={20}  color="#FD6A02" name={'person'} />
                            </View>
                            <Text style={settingStyles.settingOptionsText}>{"Profile"}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            key={'Microphone'}
                            style={settingStyles.settingOptionsButton}
                            onPress={this.navigateSettings.bind(this, 'Microphone')}
                        >
                            <View style={settingStyles.icons}>
                                <Icon size={20}  color="#FD6A02" name={this.state.micIcon} />
                            </View>
                            <Text style={settingStyles.settingOptionsText}>{'Microphone'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            key={'About'}
                            style={settingStyles.settingOptionsButton}
                            onPress={this.navigateSettings.bind(this, 'About')}
                        >
                            <View style={settingStyles.icons}>
                                <Icon size={20}  color="#FD6A02" name={'timeline'} />
                            </View>
                            <Text style={settingStyles.settingOptionsText}>{'About'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            key={'Logout'}
                            style={settingStyles.settingOptionsButton}
                            onPress={this.navigateSettings.bind(this, 'Logout')}
                        >
                            <View style={settingStyles.icons}>
                                <Icon size={20}  color="#FD6A02" name={'power-settings-new'} />
                            </View>
                            <Text style={settingStyles.settingOptionsText}>{'Logout'}</Text>
                        </TouchableOpacity>
               </View>
            </View>
      </View>
    );
  }
}

const settingStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f4f5f8"
    },
    headingWrapper : {
        paddingTop: 20,
        marginBottom: 20
    },
    headingText : {
        color: "#999",
        fontSize: 13,
        alignSelf: "center"
    },
    settingOptionsWrapper : {
        backgroundColor: "#fff"
    },
    settingOptionsButton : {
        padding: 15
    },
    settingOptionsText : {
        fontSize: 17,
        color: "#555",
        fontFamily: "Roboto-Medium"
    },
    icons : {
        position: "absolute",
        right: 15,
        top: 15,
    }
});