import React, {PropTypes, Component} from "react";
import {StyleSheet, View, Text, Button, ToastAndroid, TextInput, TouchableOpacity, AsyncStorage} from 'react-native';
import SplashScreen from "../splashscreen";
import Toast, {DURATION} from 'react-native-easy-toast'
import axios from 'axios';
import md5 from 'md5';
import Voice from 'react-native-voice';


export default class Audio extends React.Component {

    constructor() {
      super();
      this.state = {
          results : []
      }
      Voice.onSpeechResults = this.onSpeechResults.bind(this);
    }
  
    onSpeechResults(e){
      this.setState({
          results:e.value[0]
      })
    //   ToastAndroid.show(e.value , ToastAndroid.LONG);
    }
  
  //     // Voice.onSpeechStart = this.onSpeechStartHandler.bind(this);
  //     // Voice.onSpeechEnd = this.onSpeechEndHandler.bind(this);
  //     // Voice.onSpeechResults = this.onSpeechResultsHandler.bind(this);
  //   }
      onSpeechStart(){
          // alert("inside");
           Voice.start('en-US');
        //    ToastAndroid.show(spokenText , ToastAndroid.LONG);
      }
  
      onSpeechEnd(){
          Voice.stop();
      }
      
    render() {
      const { navigate } = this.props.navigation;
      return(<View style={{marginTop: 100}}><Button title="Start speech"
                 onPress={this.onSpeechStart.bind(this)}
                   />
                   <Button title="Stop speech"
                 onPress={this.onSpeechEnd.bind(this)}
                   />
                   {/*{
                       this.state.results.map((text,index)=>{
                           return(<Text key={index}>{text}</Text>)
                       })
                   }*/}
                   <Text>{this.state.results}</Text>
                   </View>)
    }
  }