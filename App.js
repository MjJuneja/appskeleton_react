import React from 'react';
import { StyleSheet, Text, View,Image,Button, AsyncStorage, NativeModules, Alert} from 'react-native';
// import BG1 from './BG1.svg';
import {createStackNavigator} from 'react-navigation';
import Navigate from './Navigate';
import SplashScreen from './components/splashscreen';
import Voice from 'react-native-voice';
import axios from 'axios';

const ReactNativeVolumeController = NativeModules.ReactNativeVolumeController;

export default class App extends React.Component {

  constructor(props) {
    super(props);

    ReactNativeVolumeController.change(0);
    this._retrieveData();

    this.state = {
      fontLoaded : true,
      userData : {},
      results : [],
      partialResult: [],
      content: ""
    }
    Voice.onSpeechResults = this.onSpeechResults.bind(this);
    Voice.onSpeechPartialResults =  this.onSpeechPartialResults.bind(this);
    Voice.onSpeechError = this.onSpeechError.bind(this);
  }

  onSpeechResults(e) {
      let content = this.state.content;
      content+=" "+e.value[0];
      this.setState ({
          results:e.value[0],
          content
      });
      // console.log("content", content);
      this.setState({content});
      this.storeContentInAsync(content);

      ReactNativeVolumeController.change(0);
      this.onSpeechStart();
  // ToastAndroid.show(e.value , ToastAndroid.LONG);
  }

  onSpeechError(e) {
      console.log("error", e.error);
      ReactNativeVolumeController.change(0);
      this.onSpeechStart();
  }

  // includes("world, welcome");

  onSpeechPartialResults(e) {
      this.setState({
          partialResult : e.value[0]
      });
      // console.log(e.value[0]);
  }

  onSpeechStart(){
      // alert("inside");
      Voice.start('en-US');
      //  ToastAndroid.show(spokenText , ToastAndroid.LONG);
  }

  onSpeechEnd(e) {
      Voice.stop();
  }

  componentDidMount() {
    console.log("mounted");
    this._setInitialMicStatus();

    // this.onSpeechStart();

    setInterval(()=>{
      let content = this.state.content.toLowerCase();
      console.log("state content", content);
      if(content!=="") {
        if( content.includes("i want to suicide") || 
        content.includes("i want to kill myself") || 
        content.includes("i am killing myself") ||
        content.includes("i will suicide") ||
        content.includes("how to kill myself") ) {
          //show alert
          Alert.alert("Hold On!","You're not alone. Confidential help is available for free.\n\nNeed help?\t13 11 14",
          [
            {text: 'OK', onPress: () => console.log('OK Pressed')}
          ]);
          console.log("don't do that.. himanshu loves you...");
        }
      }
      this.setState({content: ""});
    }, 7000);

    setInterval(()=>{
      if(this.state.content!=="") {
        this.submitVoice(this.state.content);
      }
      this.setState({content: ""});
      AsyncStorage.removeItem("content");
    }, 60000);

    // setInterval(()=>{
    //   console.log("state content", this.state.content);
    //   if(this.state.content!=="") {
    //     this.submitVoice(this.state.content);
    //   }
    //   this.setState({content: ""});
    // }, 15000);
  }

  storeContentInAsync = async (content)=> {
    await AsyncStorage.setItem("content", content);
    console.log("item store in async");
  }

  submitVoice = content => {
      axios({
          method: 'post',
          url: 'http://13.238.16.112/sentiment/create',
          headers : {
              'Content-Type' : 'application/json',
              'Authorization' : 'token '+this.state.userData.sessionId
          },
          data: {
              "content": content
          }
        }).then(data => {
            console.log(data.data);
            
        }).catch(err=>{
              console.log(err);  
        });

        axios({
          method: 'post',
          url: 'http://13.238.16.112/words/create',
          headers : {
              'Content-Type' : 'application/json',
              'Authorization' : 'token '+this.state.userData.sessionId
          },
          data: {
              "content": content
          }
        }).then(data => {
            console.log(data.data);
            
        }).catch(err=>{
              console.log(err);  
        });
  }
  
  _retrieveData = async () => {
    console.log("in retrieve data");
    try {
      const userData = await AsyncStorage.getItem('userData');
      const content = await AsyncStorage.getItem('content');
      if (userData !== null) {
        // We have data!!
        userData = JSON.parse(userData);
        console.log(userData);
        this.setState({userData});
        if(content!==null && content != "") {
          this.submitVoice(content);
        }
      } else {
          console.log("No data found");
      }
     } catch (error) {
       // Error retrieving data
       console.log(error);
     }
  }

  _retrieveMicStatus = async () => {
    console.log("in retrieve data mic flag");
    try {
      let micFlag = await AsyncStorage.getItem('micFlag');
      console.log("micFlag", micFlag);
      if(micFlag=="ON" || micFlag == null) {
        ReactNativeVolumeController.change(0);
        this.onSpeechStart();
      }
     } catch (error) {
       console.log(error);
     }
  }

  _setInitialMicStatus = ()=> {
    this._retrieveMicStatus();
    console.log("mic status changed");
  }

  _changeMicStatus = ()=> {
    
  }

  render() {
    if(this.state.fontLoaded == true) {
        return <Navigate />
    } else {
      return <SplashScreen />;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
